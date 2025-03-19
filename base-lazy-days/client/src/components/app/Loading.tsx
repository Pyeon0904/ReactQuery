import {Spinner, Text} from "@chakra-ui/react";
import {useIsFetching} from "@tanstack/react-query";

export function Loading() {
  const isFetching = useIsFetching(); // useIsFetching이 반환하는 무엇이든으로 바꿀 수 있다.
  // 위 useIsFetching은 현재 '가져오기(fetch)상태'인 Query 호출의 수를 나타내는 number(정수)를 반환한다.
  const display = isFetching ? "inherit" : "none";
  // 따라서 isFetching이 0보다 크면 Fetching 상태의 호출이 있고, '참'이기에 inherit = Loading Spinner 표시!
  // 현재 가져오는 항목이 0인 경우, 0은 false이기에 none! = Loading Spinner 표시X

  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="olive.200"
      color="olive.800"
      role="status"
      position="fixed"
      zIndex="9999"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      display={display}
    >
      <Text display="none">Loading...</Text>
    </Spinner>
  );
}
