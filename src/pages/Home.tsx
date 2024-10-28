import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import UserList from "../components/UserList";
import { SEARCH_USERS } from "../graphql/queries";
import { Button, Form, Spinner } from "react-bootstrap";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, { loading, data }] = useLazyQuery(SEARCH_USERS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers({ variables: { query: searchQuery } });
  };

  return (
    <div>
      <Form onSubmit={handleSearch} className="d-flex justify-content-center">
        <Form.Group controlId="searchQuery">
          <Form.Control
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for users"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="ms-2">
          Search
        </Button>
      </Form>
      {loading && <Spinner animation="border" />}
      {data && <UserList users={data.search.edges} />}
    </div>
  );
};

export default Home;
