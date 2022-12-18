# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

## Epic

Allow a Facility to set a Custom Id for an Agent

## Ticket 1

### **Acceptance criteria**

Store custom metadata (`custom_id`) for each Agent working with each Facility

### **Implementaion details**

- The DB has a table **AgentFacilityMetadata** with the fields:
  - agent_id (a primary key, same as the internal `id` from `Agent` table)
  - facility_id (a foreign key, same as the internal `id` from `Facility` table)
  - custom_id (unique key)
- A query that allows to aggregate all Agent's `cutom_id` by the `facility_id`

Note: For now we only need **custom_id**, but we might need more metadata in the future

### **Time/effort estimates:**

3 story points

## Ticket 2

Let's suppose that the facility interacts with our system via a REST API, we need a CRUD interface for facilities to manage the Agents metadata

### **Acceptance criteria**

Create 5 endpoints:

- `GET /agentsByFacility/:facility_id/:agent_id`: returns Agent metadata
- `POST /agentsByFacility/:facility_id/:agent_id`: returns created metadata for the Agent
  - body: `{custom_id: string}`
- `PUT /agentsByFacility/:facility_id/:agent_id`: returns updated metadata for the Agent
  - body: `{custom_id: string}`
- `DELETE /agentsByFacility/:facility_id/:agent_id`: returns the id of the Agent whose metadata was deleted
- `GET /agentsByFacility/:facility_id` returns all Agents by the Facility

Add validation:

- The `custom_id` should be unique for each Agent in the context of one Facility

### **Time/effort estimates**

5 story points

## Ticket 3

### **Acceptance criteria**

Add validation for `POST` and `PUT` actions:

- The `custom_id` should be unique for each Agent in the context of one Facility

### **Time/effort estimates**

1 story points

## Ticket 4

### **Acceptance criteria**

When a Facility generates a report it should see the provided custom ids for each agent, with a fallback to internal id when custom id is not set.

### **Implementaion details**

- Use the new query (from ticket 1) inside the `getShiftsByFacility` function to add the `custom_id` of the Agent in its metadata, for the Facility that generates the report.
- Update the `generateReport` function to use the `custom_id` (if it exists) **instead** of the internal id.

### **Time/effort estimates**

2 story points

## Notes

All Time/effort estimates are provided as story points (roughly 1 point = 1 hour) mostly to manage complexity than time spent.
