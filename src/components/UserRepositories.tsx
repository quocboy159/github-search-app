import React from "react";
import { Spinner } from "react-bootstrap";
import IssueList from "./IssueList";
import PaginationComponent from "./PaginationComponent";
import { useUserIssues } from "../hooks/useUserIssues";

const PAGE_SIZE = 10;

type UserRepositoriesProps = {
  userName: string;
  loading: boolean;
  error?: any;
  repositories: any[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (pageNumber: number) => Promise<void>;
};

const UserRepositories: React.FC<UserRepositoriesProps> = ({
  userName,
  loading,
  error,
  repositories,
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const {
    issues,
    totalCount,
    currentPage: currentIssuePage,
    loading: issuesListloading,
    error: issuesListError,
    handlePageChange: issueHandlePageChange,
    selectedRepoName,
    selectedRepoId,
    handlerSelectedRepository,
    handlerReloadList,
    resetIssues,
  } = useUserIssues();

  const handlerReposListPageChange = async (
    pageNumber: number
  ): Promise<void> => {
    await handlePageChange(pageNumber);
    resetIssues();
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="container py-5">
        <div className="row pb-3">
          <div className="col">
            <h3 className="text-start">{userName}'s Repositories</h3>
          </div>
        </div>

        {repositories.length > 0 && (
          <div className="container">
            {repositories.map(
              ({ id, name, stargazerCount, watchers: { totalCount } }: any) => (
                <div
                  className="row py-2 mx-0 border-bottom hover-effect"
                  key={id}
                  onClick={() => handlerSelectedRepository(name, id, userName)}
                >
                  <div className="col text-start">{name}</div>
                  <div className="col text-end">
                    {stargazerCount} stars / {totalCount} watching
                  </div>
                </div>
              )
            )}
            <PaginationComponent
              currentPage={currentPage}
              totalCount={totalPages}
              pageSize={PAGE_SIZE}
              onPageChange={handlerReposListPageChange}
            />
          </div>
        )}
      </div>

      {selectedRepoName && (
        <IssueList
          userName={userName}
          repoId={selectedRepoId}
          repoName={selectedRepoName}
          loading={issuesListloading}
          error={issuesListError}
          issues={issues?.nodes || []}
          currentPage={currentIssuePage}
          handlePageChange={issueHandlePageChange}
          totalPages={totalCount}
          reloadList={handlerReloadList}
        />
      )}
    </>
  );
};

export default UserRepositories;
