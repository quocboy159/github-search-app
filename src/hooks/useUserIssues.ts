import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_REPO_ISSUES } from "../graphql/queries";

const PAGE_SIZE = 10;
const MAX_FETCH_SIZE = 100; // GitHub's maximum limit

export const useUserIssues = () => {
  const [selectedRepoName, setSelectedRepoName] = useState<string>("");
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [issues, setIssues] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { loading, error, data, fetchMore, refetch } = useQuery(
    GET_REPO_ISSUES,
    {
      variables: {
        owner: selectedUser,
        name: selectedRepoName,
        first: PAGE_SIZE,
        after: null,
      },
      skip: !selectedUser && !selectedRepoName,
    }
  );

  const reLoadList = (repoName: string, userName: string) => {
    refetch({ name: repoName, owner: userName, first: PAGE_SIZE, after: null });
  };

  useEffect(() => {
    if (data?.repository?.issues) {
      setIssues(data.repository.issues);
      setTotalCount(data.repository.issues.totalCount);
      setEndCursor(data.repository.issues.pageInfo.endCursor);
    } else {
      setIssues([]);
      setTotalCount(0);
      setEndCursor(null);
    }
  }, [data]);

  const calculateIssuesList = (fetchMoreResult: any) => {
    let desiredIssues;
    const allFetchedIssues = fetchMoreResult;

    if (Array.isArray(allFetchedIssues)) {
      desiredIssues = allFetchedIssues.slice(-PAGE_SIZE);
    } else if (allFetchedIssues.edges) {
      desiredIssues = {
        ...allFetchedIssues,
        edges: allFetchedIssues.edges.slice(-PAGE_SIZE),
      };
    } else if (allFetchedIssues.nodes) {
      desiredIssues = {
        ...allFetchedIssues,
        nodes: allFetchedIssues.nodes.slice(-PAGE_SIZE),
      };
    } else {
      console.error("Unexpected Issues data structure:", allFetchedIssues);
    }

    return desiredIssues;
  };

  const handlePageChange = async (pageNumber: number) => {
    try {
      const offset = (pageNumber - 1) * PAGE_SIZE;
      const fetchSize = Math.min(MAX_FETCH_SIZE, pageNumber * PAGE_SIZE);

      if (offset >= fetchSize) {
        const result = await refetch({
          owner: selectedUser,
          name: selectedRepoName,
          first: fetchSize,
          after: null,
        });
        const allFetchedIssues = result.data.repository.issues;
        const issues = calculateIssuesList(result.data.repository.issues);
        setIssues(issues);
        setEndCursor(allFetchedIssues.pageInfo.endCursor);
      } else if (pageNumber > currentPage) {
        // moving forward
        const result = await fetchMore({
          variables: {
            after: endCursor,
            first: PAGE_SIZE,
          },
        });
        setIssues(result.data.repository.issues);
        setEndCursor(result.data.repository.issues.pageInfo.endCursor);
      } else {
        // moving backward
        const result = await refetch({
          owner: selectedUser,
          name: selectedRepoName,
          first: fetchSize,
          after: null,
        });
        const issues = calculateIssuesList(result.data.repository.issues);
        setIssues(issues);
        setEndCursor(result.data.repository.issues.pageInfo.endCursor);
      }
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };

  const handlerSelectedRepository = (
    name: string,
    id: string,
    userName: string
  ) => {
    setSelectedUser(userName);
    setSelectedRepoName(name);
    setSelectedRepoId(id);
    setCurrentPage(1);
    reLoadList(name, userName);
  };

  const resetIssues = () => {
    setIssues([]);
    setTotalCount(0);
    setEndCursor(null);
  };

  const handlerReloadList = (userName: string) => {
    debugger
    reLoadList(selectedRepoName, userName);
  };

  return {
    selectedUser,
    currentPage,
    issues,
    totalCount,
    loading,
    error,
    setSelectedUser,
    setSelectedRepoName,
    selectedRepoName,
    setSelectedRepoId,
    selectedRepoId,
    handlePageChange,
    setIssueCurrentPage: setCurrentPage,
    handlerSelectedRepository,
    resetIssues,
    handlerReloadList,
  };
};
