import React from "react";
import ProductLy02 from "../../../components/productsLayouts/ProdcutLy02";

function CategoryPage() {
  return (
    <div className="py-20   flex flex-col items-center justify-start">
      <div className="text-right w-full px-9 py-5 bg-turquoise/50 my-5">
        <h1 className="text-xl md:6xl py-1 font-bold">هدايا السفر</h1>
        <p>هدايا رائعة للرجال ، الأمر بهذه السهولة.</p>
      </div>
      <div className=" grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
          custom={true}
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
          custom={true}
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
        <ProductLy02
          title="قلادة زجاج البحر البدايات الجديدة"
          price="1200"
          fill
        />
      </div>
    </div>
  );
}

export default CategoryPage;
