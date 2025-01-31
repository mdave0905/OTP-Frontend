function CalculateAverageRating(ratings) {
  let average;
  let sum = 0;
  if (ratings.length > 0) {
    ratings.map((item, index) => {
      sum += item.points;
      return index;
    });
    average = sum / ratings.length;
    return average;
  } else {
    return 0;
  }
}

export default CalculateAverageRating;
