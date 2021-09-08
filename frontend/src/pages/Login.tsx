import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router';
import { loginUser } from '../api/user';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';
export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  is_active: string;
}

interface LoginPost {
  email: string;
  password: string;
}

interface Inputs {
  email: string;
  password: string;
}
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const history = useHistory();

  const { setIsLogged, isLogged } = useAuth();
  const { data, mutate, isSuccess } = useMutation<CurrentUser, Error, LoginPost>(
    (newTodo) => loginUser(newTodo),
    {
      onError: (e) => {
        toast.error('Error Logging In');
      },
    },
  );

  useEffect(() => {
    if (isLogged) history.push('/');
  }, []);

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      setIsLogged(true);

      toast.promise(
        new Promise(function (resolve) {
          setTimeout(resolve, 2000);
        }).then(() => {
          history.push('/');
        }),
        {
          loading: 'Logging in...',
          success: 'Logged In',
          error: 'Error Logging In',
        },
      );
    }
  }, [isSuccess]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-dark">
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
          {...register('password', { required: true })}
          placeholder="Enter your password"
          className="py-2 dark:bg-gray-darkest outline-none ring-0 border-0 focus:outline-none focus:ring-0 dark:focus:bg-black dark:text-gray-lightest rounded placeholder-gray-light"
        />
        {errors.password && <span>This field is required</span>}

        <input type="submit" className="py-2 rounded bg-indigo-500 text-white" />
      </form>
    </div>
  );
};

export default Login;
