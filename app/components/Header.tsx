"use client";

import { useState } from "react";
import Button from "./Button";
import Logo from "./Logo";
import NewProjectModal from "./NewProjectModal";

export default function Header() {
  let [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header>
        <div className=" mt-5 flex flex-row md:mt-8">
          <Logo />
          <nav className="ml-auto mobile:hidden sm:hidden md:block">
            <Button onClick={() => setIsModalOpen(true)} variant="primary">
              + new project
            </Button>
          </nav>
          <nav className=" fixed bottom-0 left-0 right-0 z-50 flex h-12 justify-center bg-darkblue  md:hidden">
            <button
              onClick={() => setIsModalOpen(true)}
              className=" z-100 absolute bottom-4 h-14 w-14 self-start rounded-full bg-softgreen font-sans text-3xl "
            >
              +
            </button>
          </nav>
        </div>
        <NewProjectModal
          isModalOpen={isModalOpen}
          handleModal={setIsModalOpen}
        />
      </header>
    </>
  );
}
