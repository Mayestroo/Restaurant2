import { useState } from "react";
import { Menu, CalendarDays, LogIn } from "lucide-react";
import Basket from "../../components/Basket";
import WaiterBasket from "../../components/WaiterBasket";
import Aside from "../Aside";
import bellIcon from "../../assets/bell.svg";
import greetingImage from "../../assets/five.avif";
import WaiterAside from "../WaiterAside";
import { useNavigate } from "react-router-dom";

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
  showCallWaiter = true
}) => {
  const [showModal, setShowModal] = useState(false);
  const isCallWaiterVisible = type !== "waiter" && type !== "cooker" && showCallWaiter;
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const LoginHandler = () => {
    if (type === "client") {
      navigate("/login");
    }
  };

  return (
    <div
      className={`header w-full bg-white ${type === "client"
        ? "flex fixed h-16 justify-between gap-3 z-50 items-center px-4 py-3"
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
            {title && (
              <div>
                <h1 className="text-xl font-semibold text-black">{title} - </h1>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
              </div>
            )}
            <h2 className="font-medium text-xl xl:text-[28px]">
              Assalamu alaykum!
            </h2>
          </div>
        )}
      </div>

      <div className="navbar flex items-center gap-3 justify-between">
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

        <div
          className={`flex items-center font-medium hover:bg-blue-200 transition gap-2 ${type === "client"
            ? "p-2 bg-white rounded-full shadow"
            : "p-2 bg-white rounded-full shadow"
            }`}
        >
          <span className="w-[34px] h-[34px] rounded-full bg-blue-100 flex justify-center items-center">
            <CalendarDays className="w-5 h-5 text-blue-500" />
          </span>
          <span className="text-base ">{formattedDate}</span>
        </div>

        {isCallWaiterVisible && (
          <button
            onClick={onCallWaiter}
            className="flex items-center gap-2 p-2 xl:px-3 bg-white rounded-full shadow hover:bg-red-200 transition"
          >
            <span className="w-[34px] h-[34px] rounded-full bg-[#FFDFDF] flex justify-center items-center">
              <img
                src={bellIcon}
                alt="bell"
                className="w-[20px] h-[20px]"
              />
            </span>
            <span className="text-base font-medium">Ofitsant chaqirish</span>
          </button>
        )}

        {!token && type === "client" && (
          <button
            className="flex items-center gap-2 p-2 rounded-full shadow hover:bg-blue-200 transition"
            onClick={() => LoginHandler()}
          >
            <span className="w-[34px] h-[34px] rounded-full bg-blue-100 flex justify-center items-center">
              <LogIn className="w-5 h-5 text-blue-500" />
            </span>
            <span className="text-base font-medium">Kirish</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
