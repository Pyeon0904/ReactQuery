import {useQuery, useQueryClient} from "@tanstack/react-query";
import dayjs from "dayjs";
import {useCallback, useEffect, useState} from "react";

import {AppointmentDateMap} from "../types";
import {getMonthYearDetails, getNewMonthYear} from "./monthYear";

import {useLoginData} from "@/auth/AuthContext";
import {axiosInstance} from "@/axiosInstance";
import {getAvailableAppointments} from "@/components/appointments/utils";
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

  // TODO : selectFn() 작성함 => useQuery에 대한 옵션으로 추가할 수 있다.
  // useQuery에 selectFn을 작성해주고, 이제는 만들고자 하는 selectFn()을 여기서 작성!
  const selectFn = useCallback((data: AppointmentDateMap, showAll: boolean) => {
    if (showAll) return data // showAll이 true라면, data 반환
    return getAvailableAppointments(data, userId); // false 라면, getAvailableAppointments 함수 반환
    // 단, 로그인한 사용자에게 예약된 appointments가 있는 경우, 빈 appointments 외에 예약된 appointments도 표시되므로
    // data와 userId가 모두 필요!
    // (로그인한 사용자가 없는 경우에는 예약되지 않은 appointments만 표시됨)
    // TODO : 위와 같은 형태의 함수는 "불안정하다!" - hooks가 다시 실행될 떄마다 재정의 되기에 => useCallback 사용!
  }, [userId]); // 1번째 인수는 함수, 2번째 인수는 종속성 배열
  
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
    // select: selectFn, // 기본적으로 이 selectFn()에는 useQuery의 quertFn() 함수에서 반환된 데이터가 전달된다.
    select: (data) => selectFn(data, showAll), // 단순히 반환된 데이터만을 받아오기보단, showAll이 참인경우, 해당 데이터를 반환하는지 확인하고 싶기에 data와 함께 showAll도 실행하는 새로운 함수를 만들어야함!
  })
  /** ****************** END 3: useQuery  ******************************* */

  return {appointments, monthYear, updateMonthYear, showAll, setShowAll};
}