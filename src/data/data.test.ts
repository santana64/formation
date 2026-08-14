import { describe, expect, it } from 'vitest';
import { courses, courseLessonCount, courseMinutes, courseQuestionCount, courseSteps, formatMinutes, getCourse, getLessonRef } from './index';

/**
 * Ces tests protègent le contenu pédagogique : une faute de frappe dans un
 * index de bonne réponse ou un identifiant dupliqué casserait silencieusement
 * un QCM ou une URL, sans que TypeScript ne s'en aperçoive.
 */

describe('intégrité du catalogue', () => {
  it('expose au moins un parcours', () => {
    expect(courses.length).toBeGreaterThan(0);
  });

  it('n’a pas d’identifiant de parcours en double', () => {
    const ids = courses.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('utilise des identifiants compatibles avec une URL', () => {
    for (const course of courses) {
      expect(course.id).toMatch(/^[a-z0-9-]+$/);
      for (const mod of course.modules) {
        expect(mod.id, `module ${mod.id}`).toMatch(/^[a-z0-9-]+$/);
        for (const lesson of mod.lessons) {
          expect(lesson.id, `leçon ${lesson.id}`).toMatch(/^[a-z0-9-]+$/);
        }
      }
    }
  });

  it('n’a pas de module ni de leçon en double dans un même parcours', () => {
    for (const course of courses) {
      const moduleIds = course.modules.map((m) => m.id);
      expect(new Set(moduleIds).size, `modules de ${course.id}`).toBe(moduleIds.length);
      for (const mod of course.modules) {
        const lessonIds = mod.lessons.map((l) => l.id);
        expect(new Set(lessonIds).size, `leçons de ${course.id}/${mod.id}`).toBe(lessonIds.length);
      }
    }
  });
});

describe('leçons', () => {
  it('ont un titre, une intro, du contenu et une durée plausible', () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          const ref = `${course.id}/${mod.id}/${lesson.id}`;
          expect(lesson.title.length, ref).toBeGreaterThan(3);
          expect(lesson.intro.length, ref).toBeGreaterThan(30);
          expect(lesson.blocks.length, ref).toBeGreaterThan(2);
          expect(lesson.duration, ref).toBeGreaterThan(0);
          expect(lesson.duration, ref).toBeLessThanOrEqual(90);
        }
      }
    }
  });

  it('ferment chaque leçon par un encadré « à retenir »', () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          const last = lesson.blocks[lesson.blocks.length - 1];
          expect(last.type, `${course.id}/${lesson.id}`).toBe('callout');
          if (last.type === 'callout') expect(last.variant).toBe('repere');
        }
      }
    }
  });

  it('ont des tableaux dont chaque ligne a autant de cellules que d’en-têtes', () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          for (const block of lesson.blocks) {
            if (block.type !== 'table') continue;
            for (const row of block.rows) {
              expect(row.length, `${lesson.id} — « ${block.caption} »`).toBe(block.head.length);
            }
          }
        }
      }
    }
  });

  it('renseignent un média uniquement sur les leçons vidéo', () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          if (lesson.kind === 'texte') expect(lesson.video, lesson.id).toBeUndefined();
          // Une vidéo publiée doit être sous-titrée.
          if (lesson.video?.src) expect(lesson.video.captions, lesson.id).toBeTruthy();
        }
      }
    }
  });
});

describe('QCM', () => {
  it('ont au moins quatre questions par module', () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        expect(mod.quiz.questions.length, `${course.id}/${mod.id}`).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it('ont un index de bonne réponse valide et des choix distincts', () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const q of mod.quiz.questions) {
          const ref = `${course.id}/${mod.id}/${q.id}`;
          expect(q.choices.length, ref).toBeGreaterThanOrEqual(3);
          expect(q.answer, ref).toBeGreaterThanOrEqual(0);
          expect(q.answer, ref).toBeLessThan(q.choices.length);
          expect(new Set(q.choices).size, `choix dupliqués dans ${ref}`).toBe(q.choices.length);
        }
      }
    }
  });

  it('expliquent chaque réponse', () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const q of mod.quiz.questions) {
          expect(q.explanation.length, `${course.id}/${q.id}`).toBeGreaterThan(40);
          expect(q.prompt.length, `${course.id}/${q.id}`).toBeGreaterThan(10);
        }
      }
    }
  });

  it('n’ont pas d’identifiant de question en double dans un même parcours', () => {
    // Les réponses sont indexées par identifiant de question : deux modules du
    // même parcours qui réutilisent « q1 » font fuiter les réponses de l'un
    // vers l'autre. C'est arrivé, et l'unicité par QCM ne suffisait pas à le voir.
    for (const course of courses) {
      const ids = course.modules.flatMap((m) => m.quiz.questions.map((q) => `${m.id}/${q.id}`));
      const bruts = course.modules.flatMap((m) => m.quiz.questions.map((q) => q.id));
      expect(new Set(ids).size, course.id).toBe(ids.length);
      expect(new Set(bruts).size, `identifiants réutilisés entre modules de ${course.id}`).toBe(bruts.length);
    }
  });

  it('n’ont pas d’identifiant de question en double dans un même QCM', () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        const ids = mod.quiz.questions.map((q) => q.id);
        expect(new Set(ids).size, `${course.id}/${mod.id}`).toBe(ids.length);
      }
    }
  });
});

describe('helpers', () => {
  it('retrouve un parcours et une leçon par identifiant', () => {
    const course = courses[0];
    const mod = course.modules[0];
    const lesson = mod.lessons[0];

    expect(getCourse(course.id)).toBe(course);
    expect(getCourse('inexistant')).toBeUndefined();

    const ref = getLessonRef(course.id, mod.id, lesson.id);
    expect(ref?.lesson).toBe(lesson);
    expect(ref?.moduleIndex).toBe(0);
    expect(getLessonRef(course.id, mod.id, 'inexistant')).toBeUndefined();
    expect(getLessonRef('inexistant', mod.id, lesson.id)).toBeUndefined();
  });

  it('construit les étapes dans l’ordre : leçons puis QCM de chaque module', () => {
    for (const course of courses) {
      const steps = courseSteps(course);
      expect(steps.length).toBe(courseLessonCount(course) + course.modules.length);

      let i = 0;
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          expect(steps[i]).toEqual({ kind: 'lesson', moduleId: mod.id, lessonId: lesson.id, label: lesson.title });
          i++;
        }
        expect(steps[i].kind).toBe('quiz');
        i++;
      }
    }
  });

  it('compte les leçons, les questions et le temps de travail', () => {
    for (const course of courses) {
      expect(courseLessonCount(course)).toBe(course.modules.reduce((n, m) => n + m.lessons.length, 0));
      expect(courseQuestionCount(course)).toBe(
        course.modules.reduce((n, m) => n + m.quiz.questions.length, 0),
      );
      expect(courseMinutes(course)).toBeGreaterThan(0);
    }
  });

  it('formate les durées en heures et minutes', () => {
    expect(formatMinutes(45)).toBe('45 min');
    expect(formatMinutes(60)).toBe('1 h');
    expect(formatMinutes(125)).toBe('2 h 05');
    expect(formatMinutes(189)).toBe('3 h 09');
  });
});
