import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_REPOS } from "../graphql/queries";

const PAGE_SIZE = 10;
const MAX_FETCH_SIZE = 100; // GitHub's maximum limit

export const useUserRepositories = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { loading, error, data, fetchMore, refetch } = useQuery(
    GET_USER_REPOS,
    {
      variables: { username: selectedUser, first: PAGE_SIZE, after: null },
      skip: !selectedUser,
    }
  );

  useEffect(() => {
    if (data?.user?.repositories) {
      setRepositories(data.user.repositories);
      setTotalCount(data.user.repositories.totalCount);
      setEndCursor(data.user.repositories.pageInfo.endCursor);
    } else {
      setRepositories([]);
      setTotalCount(0);
      setEndCursor(null);
    }
  }, [data]);

  const calculateRepositoriesList = (fetchMoreResult: any) => {
    let desiredRepositories;
    const allFetchedRepositories = fetchMoreResult;

    if (Array.isArray(allFetchedRepositories)) {
      desiredRepositories = allFetchedRepositories.slice(-PAGE_SIZE);
    } else if (allFetchedRepositories.edges) {
      desiredRepositories = {
        ...allFetchedRepositories,
        edges: allFetchedRepositories.edges.slice(-PAGE_SIZE),
      };
    } else if (allFetchedRepositories.nodes) {
      desiredRepositories = {
        ...allFetchedRepositories,
        nodes: allFetchedRepositories.nodes.slice(-PAGE_SIZE),
      };
    } else {
      console.error(
        "Unexpected repository data structure:",
        allFetchedRepositories
      );
    }

    return desiredRepositories;
  };

  const handlePageChange = async (pageNumber: number) => {
    try {
      const offset = (pageNumber - 1) * PAGE_SIZE;
      const fetchSize = Math.min(MAX_FETCH_SIZE, pageNumber * PAGE_SIZE);

      if (offset >= fetchSize) {
        // We need to fetch from the beginning to get to this page
        const result = await refetch({
          username: selectedUser,
          first: fetchSize,
          after: null,
        });
        const repos = calculateRepositoriesList(result.data.user.repositories);
        setRepositories(repos);
        setEndCursor(result.data.user.repositories.pageInfo.endCursor);
      } else if (pageNumber > currentPage) {
        // Fetch more if we're moving forward
        const result = await fetchMore({
          variables: {
            after: endCursor,
            first: PAGE_SIZE,
          },
        });
        setRepositories(result.data.user.repositories);
        setEndCursor(result.data.user.repositories.pageInfo.endCursor);
      } else {
        // We're moving backward, but within the already fetched data
        const result = await refetch({
          username: selectedUser,
          first: fetchSize,
          after: null,
        });
        const repos = calculateRepositoriesList(result.data.user.repositories);
        setRepositories(repos);
        setEndCursor(result.data.user.repositories.pageInfo.endCursor);
      }
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };

  return {
    selectedUser,
    currentPage,
    repositories,
    totalCount,
    loading,
    error,
    setSelectedUser,
    handlePageChange,
  };
};
