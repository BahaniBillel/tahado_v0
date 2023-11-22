"use client";

import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { PiDotFill } from "react-icons/pi";

export default function MyDisclosure() {
  return (
    <div className="w-full  ">
      <div className="mx-auto w-full rounded-2xl bg-white py-2">
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex flex-row-reverse w-full justify-between   py-2 text-left text-sm font-medium   
              focus:outline-none focus-visible:ring focus-visible:ring-coralPinkLight focus-visible:ring-opacity-75 border-t border-charcoal/50"
              >
                <span className="smalltitle">لكل هدية حكاية</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className=" pt-4 pb-2 para ">
                إذا لم تكن راضيًا عن مشترياتك لأي سبب من الأسباب ، راسلنا عبر
                البريد الإلكتروني في غضون 90 يومًا وسنقوم برد أموالك بالكامل ،
                دون طرح أي أسئلة.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex flex-row-reverse w-full justify-between  py-2 text-left text-sm font-medium  
              focus:outline-none focus-visible:ring focus-visible:ring-coralPinkLight focus-visible:ring-opacity-75 border-t border-charcoal/50"
              >
                <span className="smalltitle">محتوى الهدية</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className=" pt-4 pb-2 text-sm text-gray-500">
                <ul className=" space-y-3 text-right">
                  <li className=" para listDot">
                    <span>
                      خيارك المثالي لهدايا الشركات والكميات نعمل على تجربة رائعة
                      وفريدة لهديتك
                    </span>

                    <PiDotFill />
                  </li>
                  <li className="para  listDot">
                    <span>
                      خيارك المثالي لهدايا الشركات والكميات نعمل على تجربة رائعة
                      وفريدة لهديتك
                    </span>

                    <PiDotFill />
                  </li>
                  <li className=" para listDot">
                    <span>
                      خيارك المثالي لهدايا الشركات والكميات نعمل على تجربة رائعة
                      وفريدة لهديتك
                    </span>

                    <PiDotFill />
                  </li>
                </ul>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex flex-row-reverse w-full justify-between  py-2 text-left text-sm font-medium  
              focus:outline-none focus-visible:ring focus-visible:ring-coralPinkLight focus-visible:ring-opacity-75 border-t border-charcoal/50"
              >
                <span className="smalltitle">: هدية مناسبة لـ</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className=" pt-4 pb-2  ">
                <ul className=" space-y-3 text-right">
                  <li className=" para listDot">
                    <span>
                      خيارك المثالي لهدايا الشركات والكميات نعمل على تجربة رائعة
                      وفريدة لهديتك
                    </span>

                    <PiDotFill />
                  </li>
                  <li className="para  listDot">
                    <span>
                      خيارك المثالي لهدايا الشركات والكميات نعمل على تجربة رائعة
                      وفريدة لهديتك
                    </span>

                    <PiDotFill />
                  </li>
                  <li className="para  listDot">
                    <span>
                      خيارك المثالي لهدايا الشركات والكميات نعمل على تجربة رائعة
                      وفريدة لهديتك
                    </span>

                    <PiDotFill />
                  </li>
                </ul>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
