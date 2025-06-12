import { useState } from "react";
import { Menu, CalendarDays, Plus } from "lucide-react";
import Basket from "../../components/Basket";
import WaiterBasket from "../../components/WaiterBasket";
import Aside from "../Aside";
import dateIcon from "../../assets/date.svg";
import bellIcon from "../../assets/bell.svg";
import greetingImage from "../../assets/five.avif";
import WaiterAside from "../WaiterAside";

const days = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
const months = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

const today = new Date();
const formattedDate = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]
  } ${today.getFullYear()}`;

const Navbar = ({
  type = "client",
  onMenuClick,
  onCallWaiter,
  title = "",
  subtitle = "",
  showGreeting = true,
  showCallWaiter = false
}) => {

  const [showModal, setShowModal] = useState(false);
  const isCallWaiterVisible = type !== "client" && showCallWaiter;

  return (
    <div
      className={`w-full bg-white ${type === "client"
        ? "flex fixed h-16 flex-col gap-3 z-50 items-center min-[735px]:flex-row flex-wrap"
        : "flex fixed justify-between items-center px-4 py-3 z-50 shadow-sm"
        }`}
    >
      <div className="flex items-center space-x-3">
        {(type === "waiter" || type === "cooker") && (
          <button
            onClick={onMenuClick}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow"
          >
            <Menu className="w-5 h-5 text-blue-500" />
          </button>
        )}

        {showGreeting && (
          <div className="flex items-center gap-2">
            <img
              src={greetingImage}
              alt="greeting"
              className="w-[40px] h-[40px] xl:w-[60px] xl:h-[60px] rounded-full border-3 md:border-4 border-white"
            />
            <h2 className="font-medium text-xl xl:text-[28px]">
              Assalamu alaykum!
            </h2>
          </div>
        )}

        {title && (
          <div>
            <h1 className="text-lg font-semibold text-black">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 ${type === "client"
            ? "p-2 bg-white rounded-full shadow"
            : "bg-white p-2 rounded-full shadow"
            }`}
        >
          {type === "client" ? (
            <CalendarDays className="w-4 h-4 text-blue-500" />
          ) : (
            <CalendarDays className="w-4 h-4 text-blue-500" />
          )}
          <span className="text-sm xl:text-xl text font-medium">{formattedDate}</span>
        </div>

        {isCallWaiterVisible && (
          <button
            onClick={onCallWaiter}
            className="flex items-center gap-2 p-2 xl:px-3 bg-white rounded-full shadow"
          >
            <span className="w-[34px] h-[34px] xl:w-[46px] xl:h-[46px] rounded-full bg-[#FFDFDF] flex justify-center items-center">
              <img
                src={bellIcon}
                alt="bell"
                className="w-[20px] h-[20px] xl:w-[30px] xl:h-[30px]"
              />
            </span>
            <span className="text-base xl:text-xl">Ofitsant chaqirish</span>
          </button>
        )}

        {type === "waiter" ? (
          <WaiterBasket onClick={() => setShowModal(true)} />
        ) : (
          <Basket onClick={() => setShowModal(true)} />
        )}

        {type === "waiter" ? (
          <WaiterAside showModal={showModal} setShowModal={setShowModal} />
        ) : (
          <Aside showModal={showModal} setShowModal={setShowModal} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
