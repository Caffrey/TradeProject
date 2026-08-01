"use client"

import { useForm } from "react-hook-form";

type FormData = {
  username: string;
  password: string;
};

export default function TradeImport() {
  const {
    register,
    handleSubmit,
  } = useForm<FormData>();


  const loginRequest = async (data: FormData) => {
    console.log("登录请求", data);

    await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };


  const saveRequest = async (data: FormData) => {
    console.log("保存请求", data);

    await fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };


  return (
    <form>

      <input
        {...register("username")}
        placeholder="用户名"
      />

      <input
        {...register("password")}
        placeholder="密码"
        type="password"
      />


      <button
        type="button"
        onClick={handleSubmit(loginRequest)}
      >
        登录
      </button>


      <button
        type="button"
        onClick={handleSubmit(saveRequest)}
      >
        保存
      </button>

    </form>
  );
}