import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../utils/newRequest.js";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };

  return (
    <div className="flex justify-center">
      <div className="w-[1200px] m-[50px]">
        <span className="font-light text-[13px] text-[#555]">
          <Link to="/messages">Messages</Link> {" > "} John Doe {" > "}
        </span>
        
        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
        ) : (
          <div className="my-[30px] p-[50px] flex flex-col gap-20px h-[500px] overflow-scroll">
            {data.map((m) => (
              <div
                className={`flex gap-20px max-w-[600px] text-[18px] ${
                  m.userId === currentUser._id ? "flex-row-reverse self-end" : ""
                }`}
                key={m._id}
              >
                <img
                  className="w-40px h-40px rounded-full object-cover"
                  src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p
                  className={`max-w-[500px] p-20px font-light ${
                    m.userId === currentUser._id
                      ? "rounded-tl-[20px] rounded-tr-0px rounded-br-[20px] rounded-bl-[20px] bg-[royalblue] text-white"
                      : "rounded-tl-0px rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] bg-[#f4f1f1] text-[gray]"
                  }`}
                >
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <hr className="h-0 border-[0.5px] border-solid border-[#e8e6e6] mb-20px" />
        
        <form className="flex items-center justify-between" onSubmit={handleSubmit}>
          <textarea
            className="w-[80%] h-[100px] p-10px border border-solid border-[lightgray] rounded-[10px]"
            type="text"
            placeholder="write a message"
          />
          <button
            className="bg-[#1dbf73] p-20px text-white font-medium border-none rounded-[10px] cursor-pointer w-[100px]"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;