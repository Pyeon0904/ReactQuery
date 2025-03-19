import {QueryCache, QueryClient} from "@tanstack/react-query";

import {toast} from "@/components/app/toast";


function errorHandler(errorMsg: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    const action = "fetch";
    const title = `could not ${action} data: ${
      errorMsg ?? "error connecting to server"
    }`;
    toast({id, title, status: "error", variant: "subtle", isClosable: true});
  }
}

export const queryClient = new QueryClient({
  // error Handler를 작성 후, 이를 queryClient에 추가하는 데에 많은 key입력이 필요치는 않다.
  // 1. queryClient에 쿼리캐시 옵션 제공
  queryCache: new QueryCache({
    // 2. 쿼리캐시에는 onError 콜백이 있다.
    onError: (error) => { // 3. onError 콜백이 호출되면, 쿼리에서 발생한 에러가 여기 error에 전달됨
      // 4. 그 때, 실행될 error handler 작성
      errorHandler(error.message); // error 작성: 위에서 작성한 errorHandler는 string을 사용하기에 문자열(error.messge)을 전달해야함
    },
  }),
});