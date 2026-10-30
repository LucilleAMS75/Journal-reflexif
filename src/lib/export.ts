import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, ImageRun } from 'docx';
import { AppState, ActivityId } from '../types';
import { MODULES, ALL_ACTIVITIES, FINAL_ACTION_PAGE } from '../constants';

const DEFAULT_FONT = "Fira Sans";
const BODY_SIZE = 24; // 12pt
const HEADING_1_SIZE = 48; // 24pt
const HEADING_2_SIZE = 36; // 18pt
const SUB_HEADING_SIZE = 28; // 14pt

export async function exportToWord(appState: AppState, activityId?: ActivityId) {
  const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
  const sections = [];

  // Fetch logo for Word export
  let logoData: ArrayBuffer | undefined = undefined;
  try {
    const response = await fetch("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Logo_CCI_France_-_2012.svg/300px-Logo_CCI_France_-_2012.svg.png");
    if (response.ok) {
      logoData = await response.arrayBuffer();
    }
  } catch (e) {
    console.error("Could not load logo for Word export", e);
  }

  // Header Section
  const headerChildren = [];
  if (logoData) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new ImageRun({
            data: logoData as any,
            transformation: {
              width: 120,
              height: 48,
            },
          } as any),
        ],
      })
    );
  }

  headerChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Mon Livret Réflexif CCE",
          bold: true,
          size: HEADING_1_SIZE,
          color: "810464",
          font: DEFAULT_FONT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "CCE - Exercer la mission de formateur en entreprise",
          size: SUB_HEADING_SIZE,
          font: DEFAULT_FONT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Date d'export : ${new Date().toLocaleDateString('fr-FR')}`,
          size: 24,
          font: DEFAULT_FONT,
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "" })
  );

  const activitiesToExport = activityId 
    ? [...ALL_ACTIVITIES, FINAL_ACTION_PAGE].filter(a => a.id === activityId)
    : [...ALL_ACTIVITIES, FINAL_ACTION_PAGE].filter(a => appState.activities[a.id]);

  const activityChildren: any[] = [];

  activitiesToExport.forEach((activity) => {
    const data = appState.activities[activity.id];
    if (!data) return;

    activityChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: activity.title,
            bold: true,
            color: "810464",
            size: HEADING_2_SIZE,
            font: DEFAULT_FONT,
          }),
        ],
      })
    );

    const questions = activity.id === 'actions_mener' 
      ? ["Action 1", "Action 2", "Action 3"]
      : [
          "Qu'est-ce que je retiens de cette activité ?",
          "Quelles questions me suis-je posé pendant cette activité ?",
          "Quelle est la première chose concrète que je vais faire différemment ?"
        ];

    [data.question1, data.question2, data.question3].forEach((answer, index) => {
      activityChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: questions[index],
              bold: true,
              color: "810464",
              size: BODY_SIZE,
              font: DEFAULT_FONT,
            }),
          ],
        })
      );
      activityChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: answer || "(Non renseigné)",
              size: BODY_SIZE,
              font: DEFAULT_FONT,
            }),
          ],
        })
      );
      activityChildren.push(new Paragraph({ text: "" }));
    });

    activityChildren.push(new Paragraph({ text: "----------------------------" }));
    activityChildren.push(new Paragraph({ text: "" }));
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: DEFAULT_FONT,
            size: BODY_SIZE,
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [...headerChildren, ...activityChildren],
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Livret_Reflexif_${activityId || 'complet'}_${date}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
