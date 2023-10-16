import Image from "next/image";
import Result from "./Result";
import { PacmanLoader } from "react-spinners";

const ImageBox = (props) => {
  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-6/12 xl:w-7/12">
            <div
              className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              {props.imageUrl && (
                <Image
                  ref={props.imageRef}
                  src={props.imageUrl}
                  alt="logo"
                  className="dark w-full"
                  width={140}
                  height={30}
                />
              )}

              <div className="w-full px-4">
                <button
                  onClick={props.detect}
                  disabled={!props.imageUrl}
                  className="mt-3 rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                >
                  Detect
                </button>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-6/12 xl:w-5/12">
            <Result result={props.result} type={props.type} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageBox;
