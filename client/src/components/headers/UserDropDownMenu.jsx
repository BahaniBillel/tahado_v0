"use state";
import { Fragment, useEffect, useRef, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { RiUserFill } from "react-icons/ri";
import { PiSignInFill } from "react-icons/pi";
import { FaCircleUser } from "react-icons/fa6";
import { RiTodoLine } from "react-icons/ri";
import { RiMessage2Line } from "react-icons/ri";
import { MdOutlineLocalOffer } from "react-icons/md";
import { BsNewspaper } from "react-icons/bs";
import { MdNotificationsActive } from "react-icons/md";
import { LuSettings } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";

import Link from "next/link";

import { getSession, useSession } from "next-auth/react";
import UserSignOutButton from "../UserSignOutButton";
import UserSignInButton from "../UserSignInButton";

export default function UserDropDownMenu({ first_name, last_name }) {
  // Get the user's session.
  const { data, status } = useSession();

  console.log("This data from naigation bar", data.user);

  const firstName = data?.user?.first_name;
  const lastName = data?.user?.last_name;
  const userID = parseInt(data?.user?.user_id);
  const role = data?.user?.roles[0];
  console.log("role", role);
  return (
    <div className="  text-right z-40">
      <Menu as="div" className="relative inline-block text-left border-none">
        <div>
          <Menu.Button
            className="inline-flex w-full justify-center flex-row items-center  px-4 text-sm font-medium text-charcoal
          hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          >
            <RiUserFill className="text-black h-10 cursor-pointer " />
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 hover:text-turquoise  focus:rotate-180"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95 duration-500"
          enterTo="transform opacity-100 scale-100 duration-200"
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95 duration-200"
        >
          <Menu.Items
            className="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-lightGray 
           bg-white rounded-lg  border-none ring-1 ring-black/5 focus:outline-none shadow-md "
          >
            <div className=" ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-turquoise/40 text-charcoal/80"
                        : "text-charcoal"
                    } group flex  flex-row w-full items-center 
                    rounded-md px-2 py-2 text-sm bg-lightGray/80 `}
                  >
                    {active ? (
                      <FaCircleUser
                        aria-hidden="true"
                        className="mr-2 h-5 w-5"
                      />
                    ) : (
                      <FaCircleUser
                        aria-hidden="true"
                        className="mr-2 h-5 w-5"
                      />
                    )}
                    <div className="flex flex-col flex-nowrap justify-center items-start whitespace-pre ml-1">
                      <p className="font-semibold text-base">
                        Hi, {firstName} {lastName}
                      </p>
                      <p className="text-xs text-charcoal/70">
                        View your profile
                      </p>

                      <p className="text-xs text-charcoal/70">
                        {role === "admin"
                          ? "Role : Administrator"
                          : "Role :User"}
                      </p>
                    </div>
                  </button>
                )}
              </Menu.Item>
              {role === "admin" ? (
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/admin"
                      className={`${
                        active
                          ? "bg-turquoise/40 text-charcoal/80"
                          : "text-charcoal"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {active ? (
                        <RxDashboard
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <RxDashboard
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                      Dashboard
                    </Link>
                  )}
                </Menu.Item>
              ) : null}
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-turquoise/40 text-charcoal/80"
                        : "text-charcoal"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <RiTodoLine className="mr-2 h-5 w-5" aria-hidden="true" />
                    ) : (
                      <RiTodoLine className="mr-2 h-5 w-5" aria-hidden="true" />
                    )}
                    Purchases & reviews
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-turquoise/40 text-charcoal/80"
                        : "text-charcoal"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <RiMessage2Line
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <RiMessage2Line
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Messages
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-turquoise/40 text-charcoal/80"
                        : "text-charcoal"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <MdOutlineLocalOffer
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <MdOutlineLocalOffer
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Special Offers
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-turquoise/40 text-charcoal/80"
                        : "text-charcoal"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <MdNotificationsActive
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <MdNotificationsActive
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Notifications
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-turquoise/40 text-charcoal/80"
                        : "text-charcoal"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <BsNewspaper
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <BsNewspaper
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    News
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-turquoise/40 text-charcoal/80"
                        : "text-charcoal"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <LuSettings className="mr-2 h-5 w-5" aria-hidden="true" />
                    ) : (
                      <LuSettings className="mr-2 h-5 w-5" aria-hidden="true" />
                    )}
                    Account Settings
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-turquoise/40 text-charcoal/80"
                        : "text-charcoal"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <PiSignInFill />
                    ) : (
                      <PiSignInFill className="rotate-180" />
                    )}
                    <ul className="   ">
                      <li>
                        {firstName ? (
                          <UserSignOutButton />
                        ) : (
                          <UserSignInButton />
                        )}
                      </li>
                    </ul>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

function EditInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArchiveInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
      <path d="M8 12H12" s stroke="#333333" strokeWidth="2" />
    </svg>
  );
}

function ArchiveActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#333333" strokeWidth="2" />
    </svg>
  );
}

function MoveInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#333333" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#333333" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#333333" strokeWidth="2" />
    </svg>
  );
}

function MoveActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#333333" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#333333" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#333333" strokeWidth="2" />
    </svg>
  );
}

function DeleteInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#333333" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#333333" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#333333" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#333333" strokeWidth="2" />
    </svg>
  );
}
