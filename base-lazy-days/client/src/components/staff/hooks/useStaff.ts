import {useQuery} from "@tanstack/react-query";
import {useCallback, useState} from "react";

import type {Staff} from "@shared/types";

import {filterByTreatment} from "../utils";

import {axiosInstance} from "@/axiosInstance";
import {queryKeys} from "@/react-query/constants";

async function getStaff(): Promise<Staff[]> {
  const {data} = await axiosInstance.get("/staff");
  return data;
}

// alternative to defining inside the hook with `useCallback`,
//   in lines 31 - 37
// suggested by Niv Bekelman in this Q&A thread
//   https://www.udemy.com/course/learn-react-query/learn/#questions/21529264/
// const selectFn = (unfilteredStaff: Staff[], filter: string) => {
//   if (filter === "all") return unfilteredStaff;
//   return filterByTreatment(unfilteredStaff, filter);
// };

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  const selectFn = useCallback(
    (unfilteredStaff: Staff[]) => {
      if (filter === "all") return unfilteredStaff; // fiter의 값이 "all" => unfilteredStaff(필터링할 항목이 없는 상태) 반환
      return filterByTreatment(unfilteredStaff, filter);
    }, [filter]); // 아니라면, unfilteredStaff 및 filter 상태값이 무엇이든, utils에 작성되어 있는 filterByTreatment 함수를 실행해 treatment별로 필터링된 직원이 반환
  // filter 라는 종속성을 둔다!
  // filter가 변경될 때마다 이 선택기가 다시 실행되도록 하려면,
  // filter가 변경되면 데이터가 변경되지 않더라도 선택 함수가 변경된 다음 선택기가 다시 실행되도록 해야한다.

  const fallback: Staff[] = [];
  const {data: staff = fallback} = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: selectFn,
    // or, if the selectFn is defined outside the hook
    //   as show in lines 20 - 23
    // select: (data) => selectFn(data, filter)
  });

  return {staff, filter, setFilter};
}