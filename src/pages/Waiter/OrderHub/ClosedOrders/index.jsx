import { Loader2 } from "lucide-react";
import { useClosedOrders } from "../../../../api/useClosedOrders ";

const ClosedOrders = () => {
  const { orders, loading, error } = useClosedOrders();

  console.log("Yopilgan buyurtmalar:", orders);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Yopilgan Buyurtmalar</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders?.length === 0 ? (
        <p className="text-gray-500">Hozircha yopilgan buyurtmalar yo'q.</p>
      ) : (
        <ul className="space-y-4">
          {orders?.map((order) => {
            console.log("Order:", order.orderNumber); 
            return (
              <li
                key={order.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <p>
                  <span className="font-medium">Stol raqami:</span> {order.tableId}
                </p>
                <p>
                  <span className="font-medium">Narxi:</span> {order.totalPrice}
                </p>
                <p>
                  <span className="font-medium">Raqami:</span> {order.orderNumber}
                </p>
                <p>
                  <span className="font-medium">Yaratilgan:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ClosedOrders;