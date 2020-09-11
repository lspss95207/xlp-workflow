# bbb-html5-client
Fork from the bigbluebutton-html5 folder in https://github.com/bigbluebutton/bigbluebutton/.


# BPMN Callable events
- Location: bigbluebutton-html5/imports/ui/components/bpmn/editor/component.jsx
- Usage: emitter.emit( [Event Name] , [Arguments]...)  

| Event Name             | Arguments                          | Description                  |
|------------------------|------------------------------------|------------------------------|
| createShape            | message(string), tags(tags object) |Add message into Mindmap      |
| updateShapeColor       | elementID(string), color(string)   |Change Element's color        |
| updateShapeStrokeColor | elementID(string), color(string)   |Change Element's stroke color |