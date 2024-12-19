function getBuyQuantity(initialQty, buyCount, incrementPercent, round = true) {
  let updatedQuantity;

  if (buyCount <= 0) {
    // אם buyCount שווה ל-0 או פחות, מחזירים את הכמות המקורית
    updatedQuantity = initialQty;
  } else if (buyCount === 1) {
    // אם buyCount שווה ל-1, מכפילים ב-2
    updatedQuantity = initialQty * 2;
  } else {
    // מקרים שבהם buyCount >= 2
    const multiplier = 1 + (buyCount - 1) * (incrementPercent / 100);
    updatedQuantity = initialQty * multiplier;
  }

  // עיגול מלא
  if (round) {
    updatedQuantity = Math.round(updatedQuantity); // עיגול הכמות אם נדרש
  }
  buyCount += 1;
  return console.log(updatedQuantity);
  return updatedQuantity;
}

// דוגמה
getBuyQuantity(4, 1, 150, true);
