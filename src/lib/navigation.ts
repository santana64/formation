import type { Course } from '../data/types';
import { courseSteps, type Step } from '../data';

export function stepHref(courseId: string, step: Step): string {
  return step.kind === 'lesson'
    ? `/formations/${courseId}/modules/${step.moduleId}/lecons/${step.lessonId}`
    : `/formations/${courseId}/modules/${step.moduleId}/qcm`;
}

/** Étapes précédente et suivante autour de l'étape courante d'un parcours. */
export function neighbours(course: Course, current: { moduleId: string; lessonId?: string }) {
  const steps = courseSteps(course);
  const index = steps.findIndex((s) =>
    current.lessonId
      ? s.kind === 'lesson' && s.moduleId === current.moduleId && s.lessonId === current.lessonId
      : s.kind === 'quiz' && s.moduleId === current.moduleId,
  );
  return {
    prev: index > 0 ? steps[index - 1] : undefined,
    next: index >= 0 && index < steps.length - 1 ? steps[index + 1] : undefined,
    position: index + 1,
    total: steps.length,
  };
}
