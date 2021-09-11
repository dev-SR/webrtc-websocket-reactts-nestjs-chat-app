import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router';
import { registerUser } from '../api/user';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';
export interface RegisterResponse {
  email: string;
  name: string;
}

interface RegisterPostBody {
  email: string;
  password: string;
  name: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPostBody>();

  const history = useHistory();

  const { isLogged } = useAuth();
  const { mutate, isSuccess, isError, data } = useMutation<
    RegisterResponse,
    Error,
    RegisterPostBody
  >((newTodo) => registerUser(newTodo));

  useEffect(() => {
    if (isLogged) history.push('/');
  }, []);

  if (isError) {
    toast.error('Error');
  }

  if (isSuccess) {
    setTimeout(() => {
      toast.success('Success');
    }, 100);
    setTimeout(() => {
      history.push('/login');
    }, 500);
  }

  const onSubmit: SubmitHandler<RegisterPostBody> = (data) => {
    mutate(data);
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-dark space-y-4">
      <Toaster position="top-center" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 w-1/2 md:w-1/4">
        <input
          type="text"
          {...register('email', { required: true })}
          placeholder="Enter your email"
          className="py-2 dark:bg-gray-darkest outline-none ring-0 border-0 focus:outline-none focus:ring-0 dark:focus:bg-black dark:text-gray-lightest rounded placeholder-gray-light"
        />
        {errors.email && <span>This field is required</span>}

        <input
          type="text"
          {...register('name', { required: true })}
          placeholder="Enter your name"
          className="py-2 dark:bg-gray-darkest outline-none ring-0 border-0 focus:outline-none focus:ring-0 dark:focus:bg-black dark:text-gray-lightest rounded placeholder-gray-light"
        />
        {errors.name && <span>This field is required</span>}

        <input
          type="text"
          {...register('password', { required: true })}
          placeholder="Enter your password"
          className="py-2 dark:bg-gray-darkest outline-none ring-0 border-0 focus:outline-none focus:ring-0 dark:focus:bg-black dark:text-gray-lightest rounded placeholder-gray-light"
        />
        {errors.password && <span>This field is required</span>}

        <input
          type="submit"
          className="py-2 rounded bg-indigo-500 text-white"
          value="Register"
        />
      </form>{' '}
      <div className="flex items-center justify-end w-1/2 md:w-1/4 pr-2">
        <button
          className="text-sm text-indigo-500"
          onClick={() => {
            history.push('/login');
          }}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
