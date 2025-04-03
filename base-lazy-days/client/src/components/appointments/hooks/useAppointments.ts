import {useQuery, useQueryClient} from "@tanstack/react-query";
import dayjs from "dayjs";
import {useEffect, useState} from "react";

import {AppointmentDateMap} from "../types";
import {getMonthYearDetails, getNewMonthYear} from "./monthYear";

import {useLoginData} from "@/auth/AuthContext";
import {axiosInstance} from "@/axiosInstance";
import {queryKeys} from "@/react-query/constants";

async function getAppointments(year: string, month: string): Promise<AppointmentDateMap> {
  const {data} = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

export function useAppointments() {
  /** ****************** START 1: monthYear state *********************** */
  const currentMonthYear = getMonthYearDetails(dayjs());
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }

  /** ****************** END 1: monthYear state ************************* */

  /** ****************** START 2: filter appointments  ****************** */
  const [showAll, setShowAll] = useState(false);
  const {userId} = useLoginData();
  /** ****************** END 2: filter appointments  ******************** */

  /** ****************** START 3: useQuery  ***************************** */
    // TODO: update with useQuery!
  const queryClient = useQueryClient();
  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery({
      queryKey: [
        queryKeys.appointments,
        nextMonthYear.year,
        nextMonthYear.month
      ],
      queryFn: () => getAppointments(nextMonthYear.year, nextMonthYear.month),
    });
  }, [queryClient, monthYear]);

  // 1. fallback으로 바꾼다
  // const appointments: AppointmentDateMap = {};
  const fallback: AppointmentDateMap = {};
  const {data: appointments = fallback} = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
  })
  /** ****************** END 3: useQuery  ******************************* */

  return {appointments, monthYear, updateMonthYear, showAll, setShowAll};
}