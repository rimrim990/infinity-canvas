# InfinityCanvas

## 1. Project Overview

Infinity Canvas is a **Figma-style infinite canvas editor built** for the web.

The goal of this project is to explore how modern browsers handle **large-scale UI interactions, rendering, and
performance optimization.**

Instead of focusing only on UI features, the project emphasizes:

- efficient rendering strategies
- interaction handling
- browser-native APIs
- React performance optimization

The editor allows users to create and manipulate visual elements on an **infinite canvas**, similar to tools like Figma
or diagrams.net.

## 2. Core Features

The editor provides three main categories of functionality:

1. Canvas Interaction
2. Element Editing
3. Editor Interface

### 2.1 Canvas Interaction

Canvas interaction defines how users navigate and move within the workspace.

### Pan

Users can move across the canvas.

Possible interactions:

- Middle mouse drag
- Space + drag

### Zoom

Users can zoom in and out of the canvas.

Typical interactions:

- Mouse wheel zoom
- Zoom control in the UI

### Infinite Canvas

The workspace is not limited to a fixed size.
Users can navigate freely in any direction.

## 2.2 Element Editing

Users can create and manipulate visual elements on the canvas.

### Element Creation

Supported element types:

- Rectangle
- Ellipse
- Text
- Connector (line between elements)

### Element Selection

Users can select elements in multiple ways:

- Click selection
- Shift + click for multi-selection
- Drag selection box

### Element Movement

Selected elements can be moved by dragging.

### Element Resizing

When an element is selected, resize handles appear around it.

Users can drag these handles to resize the element.

### Element Deletion

Selected elements can be deleted using the **Delete key**.

## 2.3 Editor Interface

The editor UI consists of several panels that help users manage the canvas.

### Toolbar

The toolbar provides tools for creating and interacting with elements.

Example tools:

- Select tool
- Rectangle tool
- Ellipse tool
- Text tool
- Connector tool

### Layers Panel

The Layers panel displays all elements in the current canvas.

Possible features:

- Element list
- Selection synchronization
- Visibility toggle

### Inspector Panel

The Inspector panel allows users to edit properties of the selected element.

Example properties:

Position

- X
- Y

Size

- Width
- Height

Style

- Fill color
- Stroke color

### Status Bar

The status bar displays information about the current editor state.

Example information:

- Zoom level
- Cursor position
- Number of elements on the canvas

Optional:

- FPS (performance indicator)

### 3. User Workflow

A typical workflow might look like this:

1. The user opens a new canvas.
2. The user selects the Rectangle tool from the toolbar.
3. The user clicks on the canvas to create a rectangle.
4. The user drags the rectangle to change its position.
5. The user creates additional elements.
6. The user selects multiple elements using a drag selection box.
7. The user navigates the canvas using zoom and pan.

## 4. Initial MVP Scope

To keep the project manageable, the first version will include the following features:

Canvas

- Pan
- Zoom

Elements

- Rectangle creation
- Selection
- Move
- Resize
- Delete

Editor UI

- Toolbar
- Layers panel
- Inspector panel

More advanced features and performance optimizations will be added in later stages.
