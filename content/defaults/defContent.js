export const defContent = [
  {
    name: `nav-list`,
    value: [{ path: "/admin", adminOnly: true, title: "אדמין-פאנל-ניהול" }],
    description: `זהו נתוני התפריט של האתר`,
    allUsers: true,
  },
  {
    name: `add-product-form-fields`,
    value: [
      {
        type: `text`,
        sign: `name`,
        title: `שם מוצר`,
        required: true,
        placeHolder: `הכנס כאן את השם`,
      },
      {
        type: `textarea`,
        sign: `details`,
        title: `תיאור על המוצר`,
        required: true,
        placeHolder: `הכנס כאן את התיאור`,
      },
    ],
    description: `זהו נתוני התפריט של האתר`,
    allUsers: true,
  },
];
