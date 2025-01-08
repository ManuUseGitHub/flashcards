export const isAnniversary = (inputDate: string) => {
  const todaysDate = new Date();
  const inputed = new Date(inputDate);

  const [id, im, iy] = [
    inputed.getDate(),
    inputed.getMonth(),
    inputed.getFullYear(),
  ];
  const [td, tm, ty] = [
    todaysDate.getDate(),
    todaysDate.getMonth(),
    todaysDate.getFullYear(),
  ];

  return { isAnniversary: id == td && im == tm, diff: ty - iy };
};
