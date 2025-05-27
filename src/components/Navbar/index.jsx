import { useState } from "react";
import { Menu, CalendarDays, Plus } from "lucide-react";
import Basket from "../../components/Basket";
import Aside from "../Aside";
import dateIcon from "../../assets/date.svg";
import bellIcon from "../../assets/bell.svg";
import greetingImage from "../../assets/five.avif";

const days = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
const months = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", 
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

const today = new Date();
const formattedDate = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

const Navbar = ({
  type = "client",
  onMenuClick,
  onCallWaiter,
  onAddOrder,
  title = "",
  subtitle = "",
  showGreeting = false,
  showCallWaiter = false,
  showAddOrder = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`w-full ${type === "client" ? "flex flex-col gap-3 items-center min-[735px]:flex-row flex-wrap md:justify-between" : "flex justify-between items-center px-4 py-3 bg-gray-50 shadow-sm"}`}>
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {type === "waiter" && (
          <button onClick={onMenuClick} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow">
            <Menu className="w-5 h-5 text-blue-500" />
          </button>
        )}

        {showGreeting && (
          <div className="flex items-center gap-2">
            <img src={greetingImage} alt="greeting" className="w-[40px] h-[40px] xl:w-[60px] xl:h-[60px] rounded-full border-3 md:border-4 border-white" />
            <h2 className="font-medium text-xl xl:text-[28px]">Assalamu alaykum!</h2>
          </div>
        )}

        {title && (
          <div>
            <h1 className="text-lg font-semibold text-black">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 ${type === "client" ? "p-2 xl:px-3 bg-white rounded-full" : "bg-white px-3 py-1.5 rounded-full shadow"}`}>
          {type === "client" ? (
            <span className="w-[34px] h-[34px] xl:w-[46px] xl:h-[46px] rounded-full bg-[#EFF6FF] flex justify-center items-center">
              <img src={dateIcon} alt="date" className="w-[20px] h-[20px] xl:w-[30px] xl:h-[30px]" />
            </span>
          ) : (
            <CalendarDays className="w-4 h-4 text-blue-500" />
          )}
          <span className="text-sm xl:text-xl text-black">{formattedDate}</span>
        </div>

        {showCallWaiter && (
          <button onClick={onCallWaiter} className="flex items-center gap-2 p-2 xl:px-3 bg-white rounded-full shadow">
            <span className="w-[34px] h-[34px] xl:w-[46px] xl:h-[46px] rounded-full bg-[#FFDFDF] flex justify-center items-center">
              <img src={bellIcon} alt="bell" className="w-[20px] h-[20px] xl:w-[30px] xl:h-[30px]" />
            </span>
            <span className="text-base xl:text-xl">Ofitsant chaqirish</span>
          </button>
        )}

        {showAddOrder && (
          <button onClick={onAddOrder} className="flex items-center gap-2 bg-green-100 text-green-600 px-3 py-1.5 rounded-full shadow">
            <span>Buyurtma qo‘shish</span>
            <Plus className="w-4 h-4" />
          </button>
        )}

        {/* Show Basket & Sidebar */}
        <Basket onClick={() => setShowModal(true)} />
        <Aside showModal={showModal} setShowModal={setShowModal} />
      </div>
    </div>
  );
};

export default Navbar;