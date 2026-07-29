"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CheckboxCardGroup, PhoneField, RadioCardGroup, TextAreaField, TextField } from "@/components/forms/fields";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { readAttribution } from "@/lib/tracking/attribution";
import { stashLeadContentName } from "@/lib/tracking/fpixel";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { submitBrief } from "@/products/xr360/actions/submitBrief";
import {
  FIELD_LABELS,
  FORM_STEPS,
  OBJECTIF_LABELS,
  SUPPORT_ICONS,
  SUPPORT_LABELS,
  TYPE_LIEU_ICONS,
  TYPE_LIEU_LABELS,
} from "@/products/xr360/config/briefForm";
import { offers360 } from "@/products/xr360/config/content";
import { briefSchema, type Brief } from "@/products/xr360/lib/brief";
import { useOffer360Selection } from "@/products/xr360/lib/selection";
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

/** Garde anti double-clic (pattern éprouvé du funnel VR/CVM-MLR) : toute
    soumission dans cette fenêtre après une navigation d'étape est ignorée. */
const NAV_GUARD_MS = 500;

/**
 * Brief 360 en 3 étapes : lieu (type), projet (objectif, supports,
 * message), coordonnées. Même schéma Zod que le serveur ; l'attribution
 * premier-touchpoint (UTM/pub) est jointe à la soumission.
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
    getValues,
    formState: { errors },
  } = useForm<Brief>({
    resolver: standardSchemaResolver(briefSchema),
    // onSubmit : rien ne s'affiche avant « Continuer » (trigger par étape),
    // puis re-validation au change des champs déjà en erreur (cf. LeadForm).
    mode: "onSubmit",
    defaultValues: { supports: [], message: "", email: "" },
  });

  // Présélection « Choisir ce niveau » (section Offres) : supports adaptés
  // à l'offre + mention dans le message, SANS écraser un texte déjà saisi
  // (seul le texte auto précédent est remplaçable).
  const offerId = useOffer360Selection();
  const lastAutoMessage = useRef<string | null>(null);
  useEffect(() => {
    if (offerId === null) return;
    const offer = offers360.items.find((item) => item.id === offerId);
    if (offer === undefined) return;
    setValue("supports", [...offer.supports]);
    const autoMessage = `Offre envisagée : ${offer.name}.`;
    const currentMessage = getValues("message");
    if (currentMessage === "" || currentMessage === lastAutoMessage.current) {
      setValue("message", autoMessage);
      lastAutoMessage.current = autoMessage;
    }
  }, [offerId, setValue, getValues]);

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
          <RadioCardGroup
            legend={FIELD_LABELS.typeLieu}
            options={toOptions(TYPE_LIEU_LABELS, TYPE_LIEU_ICONS)}
            registration={registerField("typeLieu")}
            error={fieldError("typeLieu")}
            required
            columns={3}
          />
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
