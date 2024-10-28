import React from "react";
import UserRepositories from "./UserRepositories";
import { useUserRepositories } from "../hooks/useUserRepositories";

type User = {
  node: {
    id: string;
    login: string;
    avatarUrl: string;
  };
};

type UserListProps = {
  users: User[];
};

const UserList: React.FC<UserListProps> = ({ users }) => {
  const {
    selectedUser,
    currentPage,
    repositories,
    totalCount,
    loading,
    error,
    setSelectedUser,
    handlePageChange,
  } = useUserRepositories();

  return (
    <>
      <div className="container py-5">
        <div className="row pb-3">
          <div className="col">
            <h3 className="text-start">Users</h3>
          </div>
        </div>

        <div className="row">
          {users.map(({ node }) => (
            <div
              key={node.id}
              className="col d-inline-block"
              onClick={() => setSelectedUser(node.login)}
            >
              <img
                src={node.avatarUrl}
                alt={node.login}
                className="img-thumbnail"
              />
              <h5 className="py-2">{node.login}</h5>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <UserRepositories
          userName={selectedUser}
          loading={loading}
          error={error}
          repositories={repositories?.nodes || []}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalCount}
        />
      )}
    </>
  );
};

export default UserList;
