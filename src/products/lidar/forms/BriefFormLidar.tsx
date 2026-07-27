"use client";

import { useRef, useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  CheckboxCardGroup,
  PhoneField,
  RadioCardGroup,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { readAttribution } from "@/lib/tracking/attribution";
import { stashLeadContentName } from "@/lib/tracking/fpixel";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { submitBrief } from "@/products/lidar/actions/submitBrief";
import {
  FIELD_LABELS,
  FORM_STEPS,
  LIVRABLE_ICONS,
  LIVRABLE_LABELS,
  OBJECTIF_LABELS,
  TYPE_SITE_ICONS,
  TYPE_SITE_LABELS,
} from "@/products/lidar/config/briefForm";
import { briefSchema, type Brief } from "@/products/lidar/lib/brief";
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

/** Garde anti double-clic (pattern éprouvé des funnels VR/360). */
const NAV_GUARD_MS = 500;

/**
 * Brief LiDAR en 3 étapes : site (type, localisation, surface), mission
 * (objectif, livrables, logiciels, précisions), coordonnées. Même schéma
 * Zod que le serveur ; attribution premier-touchpoint jointe au submit.
 */
export function BriefFormLidar() {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<Brief>({
    resolver: standardSchemaResolver(briefSchema),
    mode: "onSubmit",
    defaultValues: { surface: "", livrables: [], logiciels: "", precisions: "", entreprise: "", email: "" },
  });

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
    // Mémorise le type de site pour enrichir le Lead Meta sur /lidar/merci.
    stashLeadContentName(TYPE_SITE_LABELS[brief.typeSite]);
    startTransition(async () => {
      const result = await submitBrief(brief, readAttribution());
      if (result !== undefined && !result.ok) setServerError(result.error);
    });
  }

  const fieldError = (field: keyof Brief) => errors[field]?.message;

  const registerField = (field: keyof Brief) =>
    register(field, {
      onChange: () => {
        if (errors[field] !== undefined) void trigger(field);
      },
    });

  return (
    <form
      onSubmit={(event) => {
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
      onFocus={() => pushDataLayerEventOnce("funnel_start_lidar", "funnel_start", { product: "lidar" })}
    >
      <StepIndicator steps={FORM_STEPS.map((s) => s.title)} current={step} />

      <h3 ref={stepHeadingRef} tabIndex={-1} className={styles.stepTitle}>
        {FORM_STEPS[step].title}
      </h3>

      <div className={cx(styles.fields, step === 2 && styles.fieldsTwoCol)}>
        {step === 0 && (
          <>
            <RadioCardGroup
              legend={FIELD_LABELS.typeSite}
              options={toOptions(TYPE_SITE_LABELS, TYPE_SITE_ICONS)}
              registration={registerField("typeSite")}
              error={fieldError("typeSite")}
              required
              columns={3}
            />
            <TextField
              label={FIELD_LABELS.localisation}
              placeholder={FIELD_LABELS.localisationPlaceholder}
              registration={registerField("localisation")}
              error={fieldError("localisation")}
              required
            />
            <TextField
              label={FIELD_LABELS.surface}
              placeholder={FIELD_LABELS.surfacePlaceholder}
              registration={registerField("surface")}
              error={fieldError("surface")}
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
              legend={FIELD_LABELS.livrables}
              hint={FIELD_LABELS.livrablesHint}
              options={toOptions(LIVRABLE_LABELS, LIVRABLE_ICONS)}
              registration={registerField("livrables")}
              error={fieldError("livrables")}
              columns={3}
            />
            <TextField
              label={FIELD_LABELS.logiciels}
              placeholder={FIELD_LABELS.logicielsPlaceholder}
              registration={registerField("logiciels")}
              error={fieldError("logiciels")}
            />
            <TextAreaField
              label={FIELD_LABELS.precisions}
              placeholder={FIELD_LABELS.precisionsPlaceholder}
              registration={registerField("precisions")}
              error={fieldError("precisions")}
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
            <TextField
              label={FIELD_LABELS.entreprise}
              placeholder={FIELD_LABELS.entreprisePlaceholder}
              autoComplete="organization"
              registration={registerField("entreprise")}
              error={fieldError("entreprise")}
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
