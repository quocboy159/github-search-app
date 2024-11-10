import React from "react";
import { Button, Spinner } from "react-bootstrap";
import IssueModal from "./IssueModal";
import PaginationComponent from "./PaginationComponent";
import { formatDistanceToNow } from "date-fns";
import { Issue } from "../models/IssueModel";
import { useToggle } from "../hooks/useToggle";


const PAGE_SIZE = 10;

interface IssueListProps {
  userName: string;
  repoId: string;
  repoName: string;
  loading: boolean;
  error?: any;
  currentPage: number;
  totalPages: number;
  handlePageChange: (pageNumber: number) => Promise<void>;
  issues: Issue[];
  reloadList(repoName: string): void;
}

const IssueList: React.FC<IssueListProps> = ({
  userName,
  issues,
  repoName,
  repoId,
  reloadList,
  currentPage,
  totalPages,
  handlePageChange,
  loading,
  error,
}) => {
  const { isToggled, setToggle } = useToggle(false);

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="row pb-3">
        <div className="col">
          <h3 className="text-start">{repoName}'s Open Issues</h3>
        </div>
        <div className="col text-end">
          <Button
            variant="primary"
            onClick={() => setToggle(true)}
            className="mb-3"
          >
            Create New Issue
          </Button>
        </div>
      </div>
      <IssueModal
        isOpen={isToggled}
        onClose={() => setToggle(false)}
        repositoryId={repoId}
        userName={userName}
        onSuccess={reloadList}
      />
      {issues.length === 0 && <div>There is no data</div>}
      {issues.length > 0 && (
        <div className="container">
          {issues.map(
            (
              { id, number, title, createdAt, author }: Issue,
              index: number
            ) => (
              <div
                className="row py-2 mx-0 border-bottom hover-effect"
                key={id}
              >
                <div className="col text-start">
                  {title}{" "}
                  <a
                    href={`https://github.com/${userName}/${repoName}/issues/${number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    #{PAGE_SIZE * (currentPage - 1) + index + 1}
                  </a>{" "}
                </div>
                <div className="col text-end">
                  {formatDistanceToNow(createdAt)} by{" "}
                  {author?.login || "Unknown"}
                </div>
              </div>
            )
          )}
          <PaginationComponent
            currentPage={currentPage}
            totalCount={totalPages}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default IssueList;
