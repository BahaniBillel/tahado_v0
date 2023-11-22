import freindship from "../../../public/images/freindship-gift.jpg";
import wedding from "../../../public/images/wedding-gift3.jpg";
import woman from "../../../public/images/woman-gift.jpg";
import man from "../../../public/images/man-gift.jpg";
import newBaby from "../../../public/images/baby-gift.jpg";
import success from "../../../public/images/success-gift.jpg";
export const links = [
  {
    id: 1,
    name: "هدايا الصداقة",
    page: "/new",
    sublinks: true,
    image: freindship,
  },
  {
    id: 2,
    name: "هدايا الأعراس",
    page: "/brands",
    sublinks: true,
    image: wedding,
  },
  {
    id: 3,
    name: "هدية الأنثى",
    page: "/makeup",
    sublinks: "",
    image: woman,
  },
  {
    id: 4,
    name: "هدية الرجل",
    page: "/skincare",
    sublinks: "",
    image: man,
  },
  { id: 5, name: "هدية المولود", page: "/hair", sublinks: "", image: newBaby },
  {
    id: 6,
    name: "هدايا النجاح",
    page: "/perfum",
    sublinks: "",
    image: success,
  },
];
