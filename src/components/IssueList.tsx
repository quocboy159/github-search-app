import React, { useState } from "react";
import { Button, PageItem, Spinner } from "react-bootstrap";
import { calculateDaysBetweenDates } from "../utils/helpers";
import IssueModal from "./IssueModal";
import PaginationComponent from "./PaginationComponent";

const PAGE_SIZE = 10;

type Author = {
  login: string;
};

type Issue = {
  id: string;
  number: number;
  title: string;
  body: string;
  createdAt: Date;
  author: Author | null;
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            onClick={() => setIsModalOpen(true)}
            className="mb-3"
          >
            Create New Issue
          </Button>
        </div>
      </div>
      <IssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        repositoryId={repoId}
        userName={userName}
        onSuccess={reloadList}
      />
      {issues.length === 0 && <div>There is no data</div>}
      {issues.length > 0 && (
        <div className="container">
          {issues.map(
            ({ id, number, title, createdAt, author }: Issue, index: number) => (
              <div
                className="row py-2 mx-0 border-bottom hover-effect"
                key={id}
              >
                <div className="col text-start">
                  {title} {' '}
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
                  {calculateDaysBetweenDates(createdAt)} days ago by{" "}
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
