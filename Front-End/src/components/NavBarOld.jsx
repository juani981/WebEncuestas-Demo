import react from "react";
import { Link, Route, Routes } from "react-router-dom";
//import <QuestionsCreatorComponent></QuestionsCreatorComponent>
//import SurveyDisplayComponent from "../pages/encuesta/";

export const NavBarOld = () => {
  return (
    <>
      <div className="bg-slate-100 min-h-screen">
        <nav className="rounded bg-indigo-900 text-white px-2 py-2.5 sm:px-4">
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            <a href="/" className="flex items-center">
              Web Encuestas
            </a>
            <div className="hidden w-full md:block md:w-auto">
              <ul
                className="
              mt-4
              flex flex-col
              rounded-lg
              p-4
              md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium
            ">
                <li>
                  <Link
                    to="/"
                    className="block rounded py-2 pr-4 pl-3 text-white"
                    aria-current="page">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="pages/encuesta/QuestionsCreator"
                    className="block rounded py-2 pr-4 pl-3 text-white"
                    aria-current="page">
                    Crear
                  </Link>
                </li>
                <li>
                  <Link
                    to="pages/encuesta/AnswersSubmit"
                    className="block rounded py-2 pr-4 pl-3 text-white"
                    aria-current="page">
                    Responder
                  </Link>
                </li>
                {/*<li>
                   <Link
                    to="/login"
                    className="block rounded py-2 pr-4 pl-3 text-white"
                    aria-current="page">
                    Ingresar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block rounded py-2 pr-4 pl-3 text-white"
                    aria-current="page">
                    Registrar
                  </Link> 
                </li>*/}
              </ul>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto mt-6"></div>
      </div>
    </>
  );
};
