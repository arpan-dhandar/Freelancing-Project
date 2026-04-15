import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../utils/newRequest.js";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="flex justify-center">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="max-w-[1400px] w-full py-[50px] px-0">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="h-[100px]">
                <th className="text-left">
                  {currentUser.isSeller ? "Buyer" : "Seller"}
                </th>
                <th className="text-left">Last Message</th>
                <th className="text-left">Date</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => {
                const isActive =
                  (currentUser.isSeller && !c.readBySeller) ||
                  (!currentUser.isSeller && !c.readByBuyer);

                return (
                  <tr
                    key={c.id}
                    className={`h-[100px] ${isActive ? "bg-[#1dbf730f]" : ""}`}
                  >
                    <td className="p-10px font-medium">
                      {currentUser.isSeller ? c.buyerId : c.sellerId}
                    </td>
                    <td className="p-10px text-gray-500">
                      <Link to={`/message/${c.id}`} className="text-blue-600">
                        {c?.lastMessage?.substring(0, 100)}...
                      </Link>
                    </td>
                    <td className="p-10px text-gray-500">
                      {moment(c.updatedAt).fromNow()}
                    </td>
                    <td className="p-10px">
                      {isActive && (
                        <button
                          className="bg-[#1dbf73] text-white font-medium p-10px border-none cursor-pointer"
                          onClick={() => handleRead(c.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
