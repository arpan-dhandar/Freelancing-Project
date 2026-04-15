import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest.js";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  return (
    <div className="flex justify-center text-[#555]">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="w-[1400px] py-[50px] px-0">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Orders</h1>
          </div>
          <table className="w-full">
            <thead>
              <tr className="h-[50px]">
                <th className="text-left font-semibold">Image</th>
                <th className="text-left font-semibold">Title</th>
                <th className="text-left font-semibold">Price</th>
                <th className="text-left font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr 
                  key={order._id} 
                  className="h-[50px] even:bg-[#1dbf730f]"
                >
                  <td>
                    <img 
                      className="w-[50px] h-[25px] object-cover" 
                      src={order.img} 
                      alt="" 
                    />
                  </td>
                  <td className="text-sm">{order.title}</td>
                  <td className="text-sm">{order.price}</td>
                  <td>
                    <img
                      className="w-[25px] cursor-pointer"
                      src="./img/message.png"
                      alt="message"
                      onClick={() => handleContact(order)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;