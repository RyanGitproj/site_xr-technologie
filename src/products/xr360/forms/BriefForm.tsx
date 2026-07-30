"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CheckboxCardGroup, PhoneField, RadioCardGroup, TextAreaField, TextField } from "@/components/forms/fields";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { formatAriary } from "@/lib/format/ariary";
import { readAttribution } from "@/lib/tracking/attribution";
import { stashLeadContentName } from "@/lib/tracking/fpixel";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { submitBrief } from "@/products/xr360/actions/submitBrief";
import {
  BUDGET_LABELS,
  FIELD_LABELS,
  FORM_STEPS,
  OBJECTIF_LABELS,
  OFFRE_NONE_LABEL,
  SUPPORT_ICONS,
  SUPPORT_LABELS,
  TYPE_LIEU_ICONS,
  TYPE_LIEU_LABELS,
} from "@/products/xr360/config/briefForm";
import { offers360 } from "@/products/xr360/config/content";
import { XR360_BASE_PACKS, XR360_OFFER_IDS } from "@/products/xr360/config/offers";
import { briefSchema, type Brief } from "@/products/xr360/lib/brief";
import { useXr360Selection } from "@/products/xr360/lib/selection";
import { cx } from "@/lib/cx";
import styles from "@/components/forms/formShell.module.css";

function toOptions<V extends string>(
  labels: Record<V, string>,
  icons?: Record<V, LucideIcon>,
): { value: V; label: string; icon?: LucideIcon }[] {
  return (Object.keys(labels) as V[]).map((value) => ({
    value,
    label: labels[value],
    ...(icons !== undefined && { icon: icons[value] }),
  }));
}

/** Options lieu : chaque cible du catalogue porte son accent couleur (mêmes
    tuiles que la section Offres) ; « autre » reste sur l'accent du pôle. */
const TYPE_LIEU_OPTIONS = toOptions(TYPE_LIEU_LABELS, TYPE_LIEU_ICONS).map((option) => ({
  ...option,
  ...((XR360_OFFER_IDS as readonly string[]).includes(option.value) && { accent: option.value }),
}));

/** Garde anti double-clic (pattern éprouvé du funnel VR/CVM-MLR) : toute
    soumission dans cette fenêtre après une navigation d'étape est ignorée. */
const NAV_GUARD_MS = 500;

/**
 * Brief 360 en 3 étapes : lieu (type + offre envisagée), projet (objectif,
 * supports, budget, période, message), coordonnées. Même schéma Zod que le
 * serveur ; l'attribution premier-touchpoint (UTM/pub) est jointe à la
 * soumission.
 */
export function BriefForm() {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState: { errors },
  } = useForm<Brief>({
    resolver: standardSchemaResolver(briefSchema),
    // onSubmit : rien ne s'affiche avant « Continuer » (trigger par étape),
    // puis re-validation au change des champs déjà en erreur (cf. LeadForm).
    mode: "onSubmit",
    defaultValues: { offre: "", supports: [], periode: "", message: "", email: "" },
  });

  // Présélection depuis « Choisir cette offre » (section Offres) : chaque
  // nouveau clic écrase la sélection, les champs restent modifiables ensuite.
  // shouldValidate efface une éventuelle erreur « lieu requis » affichée.
  const selection = useXr360Selection();
  useEffect(() => {
    if (selection === null) return;
    setValue("typeLieu", selection.typeLieu, { shouldValidate: true });
    setValue("offre", selection.offre, { shouldValidate: true });
  }, [selection, setValue]);

  const isLastStep = step === FORM_STEPS.length - 1;
  const lastNavAt = useRef(0);
  const navGuardActive = () => Date.now() - lastNavAt.current < NAV_GUARD_MS;

  function goTo(nextStep: number) {
    lastNavAt.current = Date.now();
    setStep(nextStep);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  async function nextStep() {
    if (navGuardActive()) return;
    const valid = await trigger(FORM_STEPS[step].fields);
    if (valid) goTo(step + 1);
  }

  function onSubmit(brief: Brief) {
    setServerError(null);
    // Mémorise le type de lieu pour enrichir le Lead Meta sur /360/merci.
    stashLeadContentName(TYPE_LIEU_LABELS[brief.typeLieu]);
    startTransition(async () => {
      const result = await submitBrief(brief, readAttribution());
      if (result !== undefined && !result.ok) setServerError(result.error);
    });
  }

  const fieldError = (field: keyof Brief) => errors[field]?.message;

  /** register + effacement immédiat : un champ DÉJÀ en erreur re-valide dès
      sa correction (trigger ciblé, ne touche pas aux autres champs). */
  const registerField = (field: keyof Brief) =>
    register(field, {
      onChange: () => {
        if (errors[field] !== undefined) void trigger(field);
      },
    });

  // Options d'offre : les 3 mêmes pour toutes les cibles (contrairement à
  // VR), teintées par l'accent du lieu choisi quand il en a un.
  const typeLieuValue: Brief["typeLieu"] | undefined = useWatch({ control, name: "typeLieu" });
  const lieuAccent =
    typeLieuValue !== undefined && (XR360_OFFER_IDS as readonly string[]).includes(typeLieuValue)
      ? typeLieuValue
      : undefined;
  const offreOptions = [
    ...XR360_BASE_PACKS.map((pack) => ({
      value: pack.id,
      label: `${pack.name} · ${offers360.pricePrefix} ${formatAriary(pack.price)}`,
      accent: lieuAccent,
    })),
    { value: "", label: OFFRE_NONE_LABEL, accent: lieuAccent },
  ];

  return (
    <form
      onSubmit={(event) => {
        // Hors dernière étape, Entrée vaut « Continuer » (jamais une
        // soumission qui validerait des champs pas encore affichés).
        if (!isLastStep) {
          event.preventDefault();
          void nextStep();
          return;
        }
        if (navGuardActive()) {
          event.preventDefault();
          return;
        }
        void handleSubmit(onSubmit)(event);
      }}
      noValidate
      onFocus={() => pushDataLayerEventOnce("funnel_start_xr360", "funnel_start", { product: "xr360" })}
    >
      <StepIndicator steps={FORM_STEPS.map((s) => s.title)} current={step} />

      <h3 ref={stepHeadingRef} tabIndex={-1} className={styles.stepTitle}>
        {FORM_STEPS[step].title}
      </h3>

      <div className={cx(styles.fields, step === 2 && styles.fieldsTwoCol)}>
        {step === 0 && (
          <>
            <RadioCardGroup
              legend={FIELD_LABELS.typeLieu}
              options={TYPE_LIEU_OPTIONS}
              registration={registerField("typeLieu")}
              error={fieldError("typeLieu")}
              required
              columns={3}
            />
            <RadioCardGroup
              legend={FIELD_LABELS.offre}
              options={offreOptions}
              registration={registerField("offre")}
              error={fieldError("offre")}
            />
          </>
        )}

        {step === 1 && (
          <>
            <RadioCardGroup
              legend={FIELD_LABELS.objectif}
              options={toOptions(OBJECTIF_LABELS)}
              registration={registerField("objectif")}
              error={fieldError("objectif")}
              required
            />
            <CheckboxCardGroup
              legend={FIELD_LABELS.supports}
              hint={FIELD_LABELS.supportsHint}
              options={toOptions(SUPPORT_LABELS, SUPPORT_ICONS)}
              registration={registerField("supports")}
              error={fieldError("supports")}
            />
            <RadioCardGroup
              legend={FIELD_LABELS.budget}
              options={toOptions(BUDGET_LABELS)}
              registration={registerField("budget")}
              error={fieldError("budget")}
              required
              columns={3}
            />
            <TextField
              label={FIELD_LABELS.periode}
              placeholder={FIELD_LABELS.periodePlaceholder}
              registration={registerField("periode")}
              error={fieldError("periode")}
              required
            />
            <TextAreaField
              label={FIELD_LABELS.message}
              placeholder={FIELD_LABELS.messagePlaceholder}
              registration={registerField("message")}
              error={fieldError("message")}
            />
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              label={FIELD_LABELS.nom}
              autoComplete="name"
              registration={registerField("nom")}
              error={fieldError("nom")}
              required
            />
            <PhoneField
              label={FIELD_LABELS.telephone}
              name="telephone"
              control={control}
              error={fieldError("telephone")}
              required
              className={styles.spanFullMobile}
            />
            <TextField
              label={FIELD_LABELS.email}
              type="email"
              autoComplete="email"
              registration={registerField("email")}
              error={fieldError("email")}
              required
              className={styles.spanFullMobile}
            />
          </>
        )}
      </div>

      {serverError !== null && (
        <p role="alert" aria-live="polite" className={styles.serverError}>
          {serverError}
        </p>
      )}

      <div className={styles.actions}>
        <div className={styles.actionsMain}>
          {step > 0 && (
            <button type="button" onClick={() => goTo(step - 1)} className={styles.back}>
              ← {FIELD_LABELS.back}
            </button>
          )}
          {isLastStep ? (
            <PrimaryButton type="submit" disabled={pending}>
              {pending ? "Envoi en cours..." : FIELD_LABELS.submit}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => void nextStep()}>{FIELD_LABELS.next}</PrimaryButton>
          )}
        </div>
      </div>
    </form>
  );
}
