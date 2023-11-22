import React from "react";

function NewsletterRibbon() {
  return (
    <div
      className="w-full h-fit md:h-32 flex flex-col md:flex-row 
    justify-center items-center my-10 px-5 py-3 md:space-x-10 border-y border-t-coralPink border-b-mustardYellow  space-y-4"
    >
      <div className="w-full md:w-1/2">
        <h2 className="smalltitle ">اشترك في رسائل البريد الإلكتروني</h2>
        <p className="para text-xs">
          يحصل المشتركون الجدد على رصيد بقيمة 5 دولارات. صالح على الطلبات 5
          دولارات أو أكثر. اقرأ الشروط والأحكام الكاملة الخاصة بنا.
        </p>
      </div>
      <div className=" w-full md:w-1/2 flex flex-row-reverse items-center justify-end  ">
        <label
          id="newsletter"
          className="bg-charcoal text-turquoise py-4 px-3 rounded-sm ml-2 whitespace-pre"
        >
          إنظم إلينا
        </label>
        <input
          type="text"
          className="input py-4 bg-white"
          id="newsletter"
          placeholder="أكتب عنوان بريدك الإلكتروني"
        />
      </div>
    </div>
  );
}

export default NewsletterRibbon;
