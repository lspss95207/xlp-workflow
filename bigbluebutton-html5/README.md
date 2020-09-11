# bbb-html5-client
Fork from the bigbluebutton-html5 folder in https://github.com/bigbluebutton/bigbluebutton/.


# BPMN Callable events
bigbluebutton-html5/imports/ui/components/bpmn/editor/component.jsx

| Event Name             | Usage                                                    | Arguments                          | Description                  |
|------------------------|----------------------------------------------------------|------------------------------------|------------------------------|
| createShape            | emitter.emit('createShape', message, tags)               | message(string), tags(tags object) |Add message into Mindmap      |
| updateShapeColor       | emitter.emit('updateShapeColor', elementID, color)       | elementID(string), color(string)   |Change Element's color        |
| updateShapeStrokeColor | emitter.emit('updateShapeStrokeColor', elementID, color) | elementID(string), color(string)   |Change Element's stroke color |