function DisplayObject() {}

DisplayObject.data = {
    delegateType : {
        value : 1,
        remove : 2,
        parentChange : 3,
        read : 4,
        state : 5,
        virtualList : 6,
        dp : 7
    },

    listener : {
        resize : 1,
        value : 2
    },

    idPrefix : "W",

    virtual : {
        divider : {
            item : "%!%",
            id : "_"
        }
    }
};

DisplayObject.objects = {};

DisplayObject.delegates = {};

DisplayObject.listeners = {};

//begin init
DisplayObject.initialize = function() {
    DisplayObject.initDelegatesObject();
    DisplayObject.initListeners();
};

DisplayObject.initDelegatesObject = function() {
    var keys = Object.keys(DisplayObject.data.delegateType);
    for( var it = 0; it < keys.length; ++it )
        DisplayObject.delegates[DisplayObject.data.delegateType[keys[it]]] = {};
};

DisplayObject.initListeners = function() {
    var keys = Object.keys(DisplayObject.data.listener);
    for( var it = 0; it < keys.length; ++it )
        DisplayObject.listeners[DisplayObject.data.listener[keys[it]]] = {};
};

DisplayObject.initialize();
//end init



//delegate registry
DisplayObject.registerDisplayObjectDelegate = function ( behavior, delegate ) {
    DisplayObject.registerDelegate(DisplayObject.data.delegateType.value, behavior, delegate);
};

DisplayObject.registerVirtualListDPValueDelegate = function( behavior, delegate ) {
    DisplayObject.registerDelegate(DisplayObject.data.delegateType.virtualList, behavior, delegate);
};

DisplayObject.registerParentChangeDelegate = function( behavior, delegate ){
    DisplayObject.registerDelegate(DisplayObject.data.delegateType.parentChange, behavior, delegate);
};

DisplayObject.registerRemoveDelegate = function( behavior, delegate ) {
    DisplayObject.registerDelegate(DisplayObject.data.delegateType.remove, behavior, delegate);
};

DisplayObject.registerReadOnlyDelegate = function( behavior, delegate ) {
    DisplayObject.registerDelegate(DisplayObject.data.delegateType.read, behavior, delegate);
};

DisplayObject.registerStateChangeDelegate = function ( behavior, delegate ) {
    DisplayObject.registerDelegate(DisplayObject.data.delegateType.state, behavior, delegate);
};

DisplayObject.registerSetDataProviderDelegate = function( behavior, delegate ) {
    DisplayObject.registerDelegate(DisplayObject.data.delegateType.dp, behavior, delegate);
};

DisplayObject.registerDelegate = function( property, behavior, delegate ) {
    DisplayObject.delegates[property][behavior] = delegate;
};
//delegate registry


//listener registry
DisplayObject.listenValueChange = function ( selector, valueListener, valueListenerDelegate ) {
    var displayObjectId = DisplayObject._get(selector).id ;
    if (!Native.isInstanced(DisplayObject.listeners[DisplayObject.data.listener.value][displayObjectId]))
        DisplayObject.listeners[DisplayObject.data.listener.value][displayObjectId] = [];
    DisplayObject.listeners[DisplayObject.data.listener.value][displayObjectId].push(
        { target : valueListener, delegate : valueListenerDelegate } );
};

DisplayObject.listenResize = function ( behavior, delegate ) {
    DisplayObject.listeners[DisplayObject.data.listener.resize][behavior] = delegate;
};
//listener registry



//delegate getters
DisplayObject.getParentChangeDelegate = function( selector ) {
    var object = DisplayObject._get(selector);

    var delegates = Object.keys(DisplayObject.delegates[DisplayObject.data.delegateType.parentChange]);
    for(var it = 0; it < delegates.length; ++it) {
        if( DisplayObject.delegates[DisplayObject.data.delegateType.parentChange][delegates[it]].isValidParent(object) )
            return DisplayObject.delegates[DisplayObject.data.delegateType.parentChange][delegates[it]];
    }

    return null;
};

DisplayObject.getDisplayObjectDelegate = function (behavior, uiType) {
    return DisplayObject.getDelegate(DisplayObject.data.delegateType.value, behavior, uiType);
};

DisplayObject.getVirtualListDPValueDelegate = function(behavior, uiType) {
    return DisplayObject.getDelegate(DisplayObject.data.delegateType.virtualList, behavior, uiType);
};

DisplayObject.getRemoveDelegate = function (behavior, uiType) {
    return DisplayObject.getDelegate(DisplayObject.data.delegateType.remove, behavior, uiType);
};

DisplayObject.getReadOnlyDelegate = function (behavior, uiType) {
    return DisplayObject.getDelegate(DisplayObject.data.delegateType.read, behavior, uiType);
};

DisplayObject.getStateChangeDelegate = function (behavior, uiType) {
    return DisplayObject.getDelegate(DisplayObject.data.delegateType.state, behavior, uiType);
};

DisplayObject.getSetDataProviderDelegate = function(behavior, uiType) {
    return DisplayObject.getDelegate(DisplayObject.data.delegateType.dp, behavior, uiType);
};

DisplayObject.getDelegate = function( property, behavior, uiType ) {
    var displayObjectDelegate = DisplayObject.delegates[property][uiType];
    if (!Native.isInstanced(displayObjectDelegate))
        displayObjectDelegate = DisplayObject.delegates[property][behavior];
    return displayObjectDelegate;
};
//delegate getters


//listeners getters
DisplayObject.getValueListeners = function( selector ) {
    var id = DisplayObject._get(selector).id;
    return DisplayObject.listeners[DisplayObject.data.listener.value][id]
};

DisplayObject.getResizeListener = function( behavior ) {
    if( !Native.isInstanced(behavior) )
        return DisplayObject.listeners[DisplayObject.data.listener.resize];
    return DisplayObject.listeners[DisplayObject.data.listener.resize][behavior];
};
//listeners getters

// Ritorna un displayObject
DisplayObject.get = function( selector ) {
    return DisplayObject._get(selector);
};

DisplayObject._get = function( selector ){
    if( typeof selector === typeof undefined || selector === null )
        return;

    var result;

    if( typeof selector === 'string' ){
        if( selector === 'virtualDom' )
            return DisplayObject.virtualDom;

        result = DisplayObject.objects[selector];
        if( typeof result !== typeof undefined && selector !== null )
            return result;

        if( selector.trim() !== '')
            result = document.getElementById(selector);

        if( DisplayObject.isCachable(result) )
            DisplayObject.objects[result.id] = result;
    }else if( selector instanceof jQuery )
        result = $(selector)[0];
    else
        result = selector;

    if( result )
        return result;

    result = DisplayObject.virtualDom.querySelector("#" + selector);

    if( result && DisplayObject.isCachable(result) )
        DisplayObject.objects[result.id] = result;

    return result;
};

DisplayObject.getId = function ( selector ) {
    var displayObject = DisplayObject._get(selector);
    if (!Native.isInstanced(displayObject))
        return null;
    return displayObject.id;
};

DisplayObject.setTitle = function( title ) {
    document.title = title;
};

DisplayObject.setIcon = function( relPath ) {
    var link = document.getElementById("app_icon");

    if( !Native.isInstanced(link)) {
        link = document.createElement("link");
        link.setAttribute("id", "app_icon");
        link.setAttribute("rel", "icon");
        document.head.appendChild(link);
    }

    link.setAttribute("href", "/resources/" + relPath);
};


// crea un nuovo displayObject
DisplayObject.create = function ( objectId, htmlType, objectType ) {
    var displayObject = document.createElement(htmlType);
    displayObject.setAttribute("id", objectId);
    displayObject.setAttribute("behavior", objectType);
    return displayObject;
};


// Properties
DisplayObject.getUIType = function (selector ) {
    return DisplayObject.getAttribute( selector, "uiType" );
};

DisplayObject.getBehavior = function ( selector ) {
    return DisplayObject.getAttribute( selector, 'behavior' );
};

DisplayObject.getLogicName = function( selector ) {
    return DisplayObject.getAttribute( selector, "ln" );
};
DisplayObject.getFullLogicName = function( selector ) {
    return DisplayObject.getAttribute( selector, "fln" );
};

DisplayObject.getLogicId = function( selector ) {
    return DisplayObject.getAttribute( selector, "lid" );
};

DisplayObject.getParent = function( selector ) {
    return DisplayObject._get(selector).parentNode;
};

DisplayObject.getParentOfType = function( selector, type ) {
    var target = DisplayObject._get(selector);

    while( target ) {
        if( target.hasAttribute && target.hasAttribute("behavior") && target.getAttribute("behavior") === type )
            return target;
        target = target.parentNode;
    }

    return null;
};


// Value
DisplayObject.getValue = function ( selector ) {
    if(!Native.isInstanced(selector) )
        return undefined;

    var displayObject = DisplayObject._get( selector );
    var displayObjectDelegate = DisplayObject.getDisplayObjectDelegate( displayObject.getAttribute("behavior"), displayObject.getAttribute("uitype") );

    if (Native.isInstanced(displayObjectDelegate) && Native.isInstanced(displayObjectDelegate.getValue))
        return displayObjectDelegate.getValue( displayObject );
    else
        return DisplayObject.getAttribute(displayObject, "value");
};


DisplayObject.setValue = function ( selector, value, skipServerEventNotification, isClientSideUpdate ) {

    var displayObject = DisplayObject._get( selector );

    if (!Native.isInstanced(displayObject)) {
        Native.error('displayobject is null: ' + selector + " : " + new Error().stack);
        return;
    }

    var skipValueAttribute = displayObject.hasAttribute("skip-value");
    if (skipValueAttribute === false) {
        var valueAttribute = displayObject.getAttribute("value");
        if (valueAttribute === value)
            return;
        displayObject.setAttribute("value", value);
    }

    var doServerNotification = !Native.isInstanced(skipServerEventNotification) || skipServerEventNotification!==true;
    var displayObjectDelegate = DisplayObject.getDisplayObjectDelegate( DisplayObject.getBehavior(displayObject), DisplayObject.getUIType(displayObject) );

    if ( doServerNotification === true && Native.isInstanced(displayObject.id) && displayObject.id !== "" ) {
        var virtualRenderer = Remoting.getParentVirtualRenderer(displayObject);

        if( Native.isInstanced(virtualRenderer) ) {
            var virtualList = Native.closestAppkitObject(virtualRenderer.parentNode);
            var virtualListDelegate = DisplayObject.getVirtualListDPValueDelegate(virtualList.getAttribute("behavior"), virtualList.getAttribute("uitype"));

            if( virtualListDelegate.isIgnorable(displayObject) )
                WebClient.setValueChangedField( DisplayObject.getLogicId(displayObject), value );
            else {
                var fields = WebClient.getValueChangedField(virtualList.id);
                fields = fields ? fields.split(DisplayObject.data.virtual.divider.item) : [];

                var objects = [];
                for(var it = 0; it < fields.length; ++it)
                    objects.push(JSON.parse(fields[it]));

                var dpItem = virtualListDelegate.getVirtualDPItem(virtualList, virtualRenderer);
                dpItem[virtualListDelegate.getItemBindIndex(virtualList, DisplayObject.getLogicName(displayObject))] = value;

                for(var it = 0; it < objects.length; ++it) {
                    if( objects[it][0] === dpItem[0] ) {
                        objects.splice(it, 1);
                        break;
                    }
                }
                objects.push(dpItem);

                fields = [];
                for(var it = 0; it < objects.length; ++it)
                    fields.push(JSON.stringify(objects[it]));
                WebClient.setValueChangedField(virtualList.id, fields.join(DisplayObject.data.virtual.divider.item));
            }
        }else
            WebClient.setValueChangedField( DisplayObject.getLogicId(displayObject), value );
    }

    if (Native.isInstanced(displayObjectDelegate) && Native.isInstanced(displayObjectDelegate.getValue))
        displayObjectDelegate.setValue( displayObject, value, skipServerEventNotification, isClientSideUpdate );

    var valueListeners = DisplayObject.getValueListeners(displayObject);
    if (Native.isInstanced(valueListeners)) {
        for ( var it=0; it<valueListeners.length; it++ )
            valueListeners[it].delegate( valueListeners[it].target, displayObject, valueAttribute, value );
    }
};



DisplayObject.setDataProvider = function( selector, dataProvider ) {
    var displayObject = DisplayObject.get(selector);
    var dpSetDelegate = DisplayObject.getSetDataProviderDelegate( DisplayObject.getBehavior(displayObject), DisplayObject.getUIType(displayObject) );

    dpSetDelegate.setDataProvider(displayObject, dataProvider);
};

DisplayObject.updateVirtualReverseStyle = function ( selector, parentSelector ) {
    var displayObject = DisplayObject._get( selector );
    var parent = DisplayObject._get( parentSelector );

    if (!Native.isInstanced(displayObject) || !Native.isInstanced(parent))
        return;

    var parentReverseStyle = DisplayObject.getAttribute( parent, "user-reverse-style" );
    var reverseStyle = DisplayObject.getAttribute( displayObject, "user-reverse-style" );

    if (reverseStyle!=="" || parentReverseStyle==="" )
        return;

    displayObject.setAttribute("user-reverse-style", parentReverseStyle);
    if (parentReverseStyle==="true")
        displayObject.setAttribute("reverse-style", "");
    else
        displayObject.removeAttribute("reverse-style");

    var itemsToPropagate = displayObject.querySelectorAll( "[user-reverse-style='']" );
    for (var it=0; it<itemsToPropagate.length; it++) {
        itemsToPropagate[it].setAttribute("user-reverse-style", parentReverseStyle);
        if (parentReverseStyle==="true")
            itemsToPropagate[it].setAttribute("reverse-style", "");
        else
            itemsToPropagate[it].removeAttribute("reverse-style");
    }
};

DisplayObject.appendChild = function ( selector, child ) {
    var target = DisplayObject._get( selector );
    if( typeof child === 'string' ){
        var div = document.createElement("div");
        div.innerHTML = child;
        child = div.firstElementChild;
    }

    if ( target === DisplayObject.virtualDom )
        DisplayObject.updateVirtualReverseStyle( child );
    else
        DisplayObject.updateVirtualReverseStyle( child, target );

    var parentDelegate = DisplayObject.getParentChangeDelegate(target);
    if( Native.isInstanced(parentDelegate) )
        parentDelegate.beforeAttach(target, child);

    return Native.appendElement(target, child);
};


DisplayObject.removeAllChildren = function ( selector ) {
    var displayObject = DisplayObject._get( selector );
    if (!Native.isInstanced(displayObject))
        return;
    displayObject.innerHTML = "";
};

DisplayObject.removeChild = function ( selector ) {
    var displayObject = DisplayObject.get( selector );
    var parent = DisplayObject.getParent(displayObject);

    var parentDelegate = DisplayObject.getParentChangeDelegate(parent);
    if( Native.isInstanced(parentDelegate) )
        parentDelegate.beforeDetach(parent, displayObject);

    Native.removeChild( displayObject );

    displayObject = DisplayObject._get(displayObject);
    var delegate = DisplayObject.getRemoveDelegate( displayObject.getAttribute("behavior"), displayObject.getAttribute("uitype"));

    if( delegate && delegate.remove )
        delegate.remove( displayObject );

    var akObjects = displayObject.querySelectorAll("[behavior]");
    for( var it = 0; it < akObjects.length; ++it ){
        var akObject = akObjects[it];
        delegate = DisplayObject.getRemoveDelegate( akObject.getAttribute("behavior"), akObject.getAttribute("uitype"));
        if( delegate && delegate.remove )
            delegate.remove( akObject );
    }
};

DisplayObject.setReadOnly = function( selector ) {
    var displayObject = DisplayObject._get(selector);
    var delegate = DisplayObject.getReadOnlyDelegate( displayObject.getAttribute("behavior"), displayObject.getAttribute("uitype"));

    if( !displayObject.hasAttribute("readonly") )
        displayObject.setAttribute("readonly", "");

    if( delegate && delegate.setReadOnly )
        delegate.setReadOnly( displayObject );
};

DisplayObject.unsetReadOnly = function( selector ) {
    var displayObject = DisplayObject._get(selector);
    var delegate = DisplayObject.getReadOnlyDelegate( displayObject.getAttribute("behavior"), displayObject.getAttribute("uitype"));

    if( displayObject.hasAttribute("readonly") )
        displayObject.removeAttribute("readonly");

    if( delegate && delegate.unsetReadOnly )
        delegate.unsetReadOnly( displayObject );
};

DisplayObject.findParentWithAttribute = function ( target, attribute ) {
    target = DisplayObject._get(target);
    while( target && target.hasAttribute ) {
        if( target.hasAttribute(attribute) )
            return target;
        target = target.parentNode;
    }

    return undefined;
};



DisplayObject.enable = function( selector ) {
    var object = DisplayObject._get(selector);

    var owners = object.querySelectorAll("[behavior][disable-owner]");
    var children = object.querySelectorAll("[behavior]:not([disable-owner])");

    var tabbedIndex = [].slice.call(object.querySelectorAll(Input.getInputSelector() + "[tabindex]"));

    object.removeAttribute("disable-owner");
    object.removeAttribute("disable");

    var excludable = [];
    for( var it = 0; it < owners.length; ++it ) {
        var owner = owners[it];

        for (var c = 0; c < children.length; ++c)
            if (owner.contains(children[c]))
                excludable.push(c);
    }

    for( var e = 0; e < owners.length; ++e ) {
        for( var t = 0; t < tabbedIndex.length; ++t ) {
            if( owners[e].contains(tabbedIndex[t]) ) {
                tabbedIndex.splice(t, 1);
                t = Math.max(0, --t);
            }
        }
    }

    for( var it = 0; it < children.length; ++it )
        if( excludable.indexOf(it) === -1 )
            children[it].removeAttribute("disable");

    for( var ti = 0; ti < tabbedIndex.length; ++ti )
        tabbedIndex[ti].removeAttribute("tabindex");
};

DisplayObject.disable = function( selector, isOwner ) {
    var object = DisplayObject._get(selector);

    if( object.hasAttribute("disable-owner") && isOwner === true )
        return;

    var children = object.querySelectorAll("[behavior]");
    var inputs = object.querySelectorAll(Input.getInputSelector());

    if( isOwner && isOwner === true )
        object.setAttribute("disable-owner", "");
    object.setAttribute("disable", "");

    for( var it = 0; it < children.length; ++it )
        children[it].setAttribute("disable", "");

    for( var i = 0; i < inputs.length; ++i )
        inputs[i].setAttribute("tabindex", "-1");
};

DisplayObject.isDisabled = function( selector ) {
    var object = DisplayObject._get(selector);
    return object.hasAttribute("disable");
};


///
DisplayObject.hide = function( selector ) {
    var object = DisplayObject._get(selector);
    if( object.hasAttribute("visible") && object.getAttribute("visible") === "false" )
        return;

    object.setAttribute("visible", "false");

    var parentVGrid = DisplayObject.getParentOfType( selector, 'vgrid' );
    if ( Native.isInstanced(parentVGrid) )
        DisplayObject.notifyResize( parentVGrid, false, true );

    var parentHGrid = DisplayObject.getParentOfType( selector, 'hgrid' );
    if ( Native.isInstanced(parentHGrid) )
        DisplayObject.notifyResize( parentHGrid, true, false );
};

DisplayObject.show = function( selector ) {
    var object = DisplayObject._get(selector);
    if(!object.hasAttribute("visible"))
        return;

    DisplayObject.removeAttribute( selector, "visible" );

    var parentVGrid = DisplayObject.getParentOfType( selector, 'vgrid' );
    var notified = false;
    if ( Native.isInstanced(parentVGrid) ){
        DisplayObject.notifyResize( parentVGrid, false, true, true );
        notified = true;
    }

    var parentHGrid = DisplayObject.getParentOfType( selector, 'hgrid' );
    if ( Native.isInstanced(parentHGrid) ){
        DisplayObject.notifyResize( parentHGrid, true, false, true );
        notified = true;
    }

    if( notified === false )
        DisplayObject.notifyResize( selector, true, true, true );
};

DisplayObject.setTransparent = function( selector ) {
    DisplayObject.setAttribute( selector, "transparent", "true" );
};

DisplayObject.unsetTransparent = function( selector ) {
    DisplayObject.removeAttribute( selector, "transparent" );
};


DisplayObject.getHiddenLayer = function() {
    return document.getElementById("hiddenLayer");
};

DisplayObject.findWithLogicName = function( selector, logicNameRegex ) {
    var displayObject = DisplayObject._get( selector );
    if ( !Native.isInstanced( displayObject ) )
        return undefined;

    var logicName = DisplayObject.getLogicName( displayObject );
    if( logicName.match(logicNameRegex) )
        return displayObject;

    return displayObject.querySelector("[ln*='" + logicNameRegex + "']");
};

/* file input manage */
DisplayObject.accept = {};

DisplayObject.prepareUploadComponent = function() {
    var element = document.createElement("input");
    element.setAttribute("type", "file");
    element.setAttribute("tabindex", "-1");
    element.setAttribute("data-url", "upload");
    element.style.opacity = 0;

    var hiddenLayer = document.getElementById("hiddenLayer");
    hiddenLayer.appendChild( element );

    DisplayObject.fileInput = element;
};

DisplayObject.prepareUploadComponent();

DisplayObject.setAsFileUploadComponent = function( selector, accept ) {
    var component = DisplayObject._get(selector);

    if( Native.isInstanced(accept) && accept.trim().length !== 0 )
        DisplayObject.accept[component.id] = accept;

    var onclick = component.getAttribute("onclick");
    if( typeof onclick === typeof undefined )
        onclick = '';

    component.setAttribute("onclick", onclick + "DisplayObject.openFileUpload(event)");
};

DisplayObject.openFileUpload = function(event) {
    var component = event.currentTarget;
    if( DisplayObject.isDisabled(component) )
        return;

    DisplayObject.fileInput.value = '';

    var acceptType = DisplayObject.accept[component.id];
    if( !Native.isInstanced(acceptType) && DisplayObject.fileInput.hasAttribute('accept') )
        DisplayObject.fileInput.removeAttribute('accept');

    if( Native.isInstanced(acceptType) )
        DisplayObject.fileInput.setAttribute('accept', acceptType);

    DisplayObject.uploadTarget = component.id;
    DisplayObject.fileInput.click();
};

 $(DisplayObject.fileInput).fileupload({
     dataType: 'json',
     replaceFileInput : false,
     add: function (e, data) {
         AppKit.lockUI();
         data.submit();
     },
     done: function (e, data) {
         var targetId = DisplayObject.uploadTarget;
         delete DisplayObject.uploadTarget;

         Remoting.dispatchServerEvent( targetId, "UPLOAD_END", undefined, data.result[0].uuid );
     }
 });


DisplayObject.clone = function (selector) {
    var element = DisplayObject._get(selector);
    var newElement = element.cloneNode( true );
    newElement.id = "dd_" + newElement.id;
    return newElement;
};

DisplayObject.getFormat = function(selector) {
    var object = DisplayObject._get(selector);
    if ( object.hasAttribute("format") )
        return object.getAttribute("format");
    return "text";
};


DisplayObject.isCachable = function( node ) {
    return node && node.id.charAt(0) === DisplayObject.data.idPrefix && node.id.indexOf(DisplayObject.data.virtual.divider.id) === -1
};
