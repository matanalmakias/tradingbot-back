async function getBuyQuantity(initialQty, buyCount, round = true) {
  let updatedQuantity; // שינוי ל-let כדי לאפשר שינוי ערך

  if (buyCount < 1) {
    updatedQuantity = initialQty;
  } else {
    updatedQuantity = initialQty * (buyCount * 2); // buyCount + 1 כדי להכפיל לפי הסדר הנכון
  }

  console.log(updatedQuantity);
  return round ? Math.ceil(updatedQuantity) : updatedQuantity;
}

// דוגמה
(async () => {
  console.log(await getBuyQuantity(18, 13, true)); // צפי: 4
})();
