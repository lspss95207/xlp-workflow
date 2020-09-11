# bbb-html5-client
Fork from the bigbluebutton-html5 folder in https://github.com/bigbluebutton/bigbluebutton/.


# BPMN Callable events
bigbluebutton-html5/imports/ui/components/bpmn/editor/component.jsx
- createShape | emitter.emit('createShape', message, tags) | Add message into Mindmap
- updateShapeColor | emitter.emit('updateShapeColor', elementID, color) | Change Element's color
- updateShapeStrokeColor | emitter.emit('updateShapeStrokeColor', elementID, color) | Change Element's stroke color