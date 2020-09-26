const React = require('react'), {
	Component,
	createContext,
	useContext,
} = React;
const RN = require('react-native')
let {
	ScrollView,
	TouchableWithoutFeedback,
	TouchableHighlight,
	LayoutAnimation,
	UIManager,
	StatusBar,
	Platform,
	Animated,
	Easing,
	Dimensions,
	PlainText,
	// StyleSheet,
	View,
	Text,
} = RN;
const Elevations = require('react-native-elevation')
const { StyleSheet, Scaling } = require('react-native-scaling')
const { Comp, Compact, TouchableNativeFeedback } = require('react-native-comp-util')
const { MenuWrapper, MenuItem, MenuDivider, Menu } = require('../components/Menu')
const StandardCurve = Easing.bezier(0.4, 0.0, 0.2, 1);
const TranslateCurve = Easing.bezier(0, 0.5, 0.5, 1);
const AcceleratedCurve = Easing.bezier(0.4, 0.0, 1, 1);
const DeceleratedCurve = Easing.bezier(0.0, 0.0, 0.2, 1);
const PathXCurve = Easing.out(Easing.ease);
const PathYCurve = Easing.in(Easing.ease);
const LinearMotion = Easing.linear;


const Arc0 = [0,1,2,3,4,5,6,7,8,9,10,1/0.04].map(v=>v*0.04);
const Arc1 = [0,0.081,0.141,0.183,0.211,0.222,0.216,0.193,0.15,0.088,0,0];
const Arc2 = [0,0.056,0.107,0.152,0.190,0.220,0.242,0.250,0.238,0.189,0,0];
const Arc3 = [0,0.057,0.105,0.144,0.174,0.192,0.200,0.190,0.160,0.103,0,0];

const s = StyleSheet.create({
	pa: {position:'absolute'},
	tl: {top:0,left:0},
	br: {bottom:0,right:0},
	tal: {textAlign:'left'},
	row: {flexDirection:'row'},
	col: {flexDirection:'column'},
	wrap: {width:'100%',height:'100%'},
	of_v: {overflow:'visible'},
	of_h: {overflow:'hidden'},
	justifyEnd: {justifyContent:'flex-end'},
	flexCenter: {justifyContent:'center',alignItems:'center'},
})

const webStyles = Platform.OS != 'web' ? {} : {
	whiteSpace: 'nowrap',
}

const sso ={
	btn: {borderRadius:4,minWidth:64,marginLeft:8,paddingHorizontal:8,height:36,justifyContent:'center'},
	btr: {marginTop:24,paddingTop:8},
	btx: {textAlign:'center',textTransform:'uppercase',fontWeight:'700',fontSize:16,lineHeight:24,marginVertical:6},
	dlg: {width:280,maxWidth:560,borderRadius:4,padding:8,paddingTop:24,overflow:'visible'},
	dht: {paddingHorizontal:16,fontSize:20,fontWeight:'600'},
	dpg: {paddingHorizontal:16,marginTop:16},
	dpt: {fontSize:14},
	lsw: {width:312,borderRadius:4,marginHorizontal:0,flexGrow:0,flexDirection:'column',overflow:'visible'},
	lsv: {flexGrow:1},
	lst: {paddingHorizontal:0,paddingBottom:8,paddingTop:8},
	lit: {paddingHorizontal:24,paddingVertical:8},
	ltx: {fontSize:16,lineHeight:32},
	sbp: {position:'absolute',flexDirection:'row',alignItems:'center',justifyContent:'flex-end',borderRadius:4,paddingHorizontal:8,paddingVertical:6,width:344,bottom:8,left:'50%',marginLeft:-172,flexWrap:'wrap',overflow:'visible'},
	sbl: {left:8,marginLeft:0,},
	sbr: {left:null,marginLeft:0,right:8},
	sbg: {marginVertical:8,minWidth:216,flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start'},
	sbt: {height:20,lineHeight:20,fontSize:14,marginHorizontal:8},
	sbx: {lineHeight:20,fontSize:14},
	sbb: {alignSelf:"flex-end"},
	tpw: {width:0,height:0},
	tpv: {paddingHorizontal:8,paddingVertical:4,borderRadius:4},
	tpo: {opacity:0.32,borderRadius:0},
	tpt: {fontSize:12,zIndex:1,...webStyles},
	tsw: {width:'100%',height:0,left:0,justifyContent:'center',alignItems:'center'},
	tsv: {paddingHorizontal:24,paddingVertical:16,borderRadius:24,maxWidth:320},
	tso: {opacity:0.8,borderRadius:0},
	tst: {fontSize:14,lineHeight:16},
	shw: {width:'100%',maxHeight:'50%',minHeight:54,left:0,bottom:0,overflow:'visible',justifyContent:'flex-start',alignItems:'center'},
	shh: {padding:4,width:'100%',height:54,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'},
	sht: {paddingHorizontal:12,fontSize:16,lineHeight:24,opacity:0.8},
	shc: {flex:1,overflow:'hidden',width:'100%',fontSize:14},
}

let ss = StyleSheet.create(sso)

const AV = {
	t:'flex-end',
	c:'center',
	b:'flex-start'
}
const AH = {
	l:'flex-end',
	c:'center',
	r:'flex-start'
}
const GV = {
	t:0,
	c:0.5,
	b:1
}
const GH = {
	l:0,
	c:0.5,
	r:1
}
const TS = {
	t:0.25,
	c:0.50,
	b:0.75
}
const SBC = {
	l:'#ffffff',
	d:'#000000'
}
const SBB = {
	l:'#323232',
	d:'#cdcdcd'
}
const TPC = {
	l:'#ffffff',
	d:'#000000'
}
const TPB = {
	l:'#6d6d6d',
	d:'#a2a2a2'
}
const TSC = {
	l:'#000000',
	d:'#ffffff'
}
const TSB = {
	l:'rgba(204,204,204,0.96)',
	d:'rgba(80,80,80,0.96)'
}
const GlobalRef = {
	popup: null,
	props: {},
	decoy: {},
}
const Timeline = [0,1]
const dimn = Dimensions.get('window')
const INST = {}
const conf = {
	scale: 1,
	theme: {
		dark: false,
		colors: {
			primary: '#00ffff',// - primary color for your app, usually your brand color.
			accent: '#00cccc',// - secondary color for your app which complements the primary color.
			background: '#ffffff',// - background color for pages, such as lists.
			surface: '#ffffff',// - background color for elements containing content, such as cards.
			text: '#000000',// - text color for content.
			error: '#dd0000',// - error.
			notification: "#f50057",// - notification.
			disabled: '#dddddd',// - color for disabled elements.
			placeholder: '#cccccc',// - color for placeholder text, such as input placeholder.
			backdrop: '#000000',// - color for backdrops of various components such as modals.
			onBackground: '#000000',
			onSurface: '#000000',
		},
		fonts: {
			light: "Roboto-Light, Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
			medium: "Roboto-Medium, Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
			regular: "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
			thin: "Roboto-Thin, Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
		},
		roundness: 4,
	}
}

const defaultBTN = Platform.select({
	android: TouchableNativeFeedback,
	default: TouchableHighlight,
})
const defaultBTNDeriveProps = (comp) => {
	// let isDark = comp.theming.theme.colors.text.replace(/[0-9A-Fa-f]{2}/g, (t)=>(parseInt(t,16)>128?'':'f')) == '#'
	let isDark = comp.theming.theme.dark
	let fg = isDark ? 255 : 0, rc = `rgba(${fg},${fg},${fg},${isDark?0.2:0.32})`
	return {
		background: TouchableNativeFeedback.Ripple(rc,false),
	}
}
const defaultBTNDeriveStyles = (comp) => {
	return {}
}
const defaultTCH = Platform.select({
	android: TouchableNativeFeedback,
	default: TouchableHighlight,
})
const defaultTCHDeriveProps = (comp) => {
	// let isDark = comp.theming.theme.colors.text.replace(/[0-9A-Fa-f]{2}/g, (t)=>(parseInt(t,16)>128?'':'f')) == '#'
	let isDark = comp.theming.theme.dark
	let fg = isDark ? 255 : 0, rc = `rgba(${fg},${fg},${fg},${isDark?0.2:0.32})`
	return {
		background: TouchableNativeFeedback.Ripple(rc,false),
	}
}
const defaultTCHDeriveStyles = (comp) => {
	return {}
}

let BTN = defaultBTN
let BTNDeriveProps = defaultBTNDeriveProps
let BTNDeriveStyles = defaultBTNDeriveStyles
let TCH = defaultTCH
let TCHDeriveProps = defaultTCHDeriveProps
let TCHDeriveStyles = defaultTCHDeriveStyles

const PopupContext = createContext({ parent: null })
const { Provider, Consumer } = PopupContext

class ConfOverrides {
	constructor(t) { this.theme = t }
	themeConfig(t) { this.theme = t }
	get Tooltip() { return {hovering:true,autohide:1500} }
	get Menu() { return {} }
	get List() { return {backdropColor:this.theme.colors.backdrop} }
	get Alert() { return {backdropColor:this.theme.colors.backdrop} }
	get Query() { return {backdropColor:this.theme.colors.backdrop} }
	get Dialog() { return {backdropColor:this.theme.colors.backdrop} }
	get Bubble() { return {reverse:true,strech:4,fade:false} }
	get Snackbar() { return {floating:true,autohide:4000} }
	get Toast() { return {hovering:true,autohide:3000} }
	get Sheet() { return {backdropColor:this.theme.colors.backdrop} }
}

class Popup extends Comp {
	state = {
		parent: this
	}
	contents = null
	animating = false
	defaults = {
		onDismiss: () => {},
		backdropColor: null,
		backdropDismiss: true,
		strech: 1,
		autohide: 0,
		hovering: false,
		floating: false,
		reverse: true,
		elevate: true,
		scaling: true,
		fade: true,
	}
	config = {
		onDismiss: () => {},
		backdropColor: null,
		backdropDismiss: true,
		strech: 1,
		autohide: 0,
		hovering: false,
		floating: false,
		reverse: true,
		elevate: true,
		scaling: true,
		fade: true,
	}
	theming = {
		theme: conf.theme,
		text: {fontFamily:conf.theme.fonts.regular,color:conf.theme.colors.text},
		accent: {fontFamily:conf.theme.fonts.regular,color:conf.theme.colors.accent},
		primary: {fontFamily:conf.theme.fonts.regular,color:conf.theme.colors.primary},
		surface: {backgroundColor:conf.theme.colors.surface},
		disabled: {color:conf.theme.colors.disabled},
		round: {borderRadius:conf.theme.roundness*conf.scale},
	}
	width = dimn.width
	height = dimn.height
	duration = 250
	visible = false
	themeFixed = false
	timerStopped = false
	timer = new Animated.Value(0)
	anim = new Animated.Value(0)
	elevateStyle = Elevations[24]
	backFadeAnimStyle = {opacity:this.anim.interpolate({inputRange:[0,1],outputRange:[0,0.32]})}
	elevateAnimStyle = Elevations.interpolate(this.anim, {inputRange:[0,0.25,1],outputRange:[0,0,24]})
	fadeAnimStyle = {opacity:this.anim.interpolate({inputRange:Timeline,outputRange:[0,1]})}
	scalingAnimStyle = {transform:[{scale:this.anim.interpolate({inputRange:Timeline,outputRange:[0.8,1]})}]}
	// elevateAnimStyle = Platform.OS == 'android'
	// 	? {elevation:this.anim.interpolate({inputRange:[0,0.25,1],outputRange:[0,0,24]})}
	// 	: Elevations[24]
	configOverrides = new ConfOverrides(conf.theme)
	static get global() {
		if(GlobalRef.popup) return GlobalRef.popup
		else return GlobalRef.decoy
	}
	static get event() {
		if(GlobalRef.popup) return {
			menu: (...args) => GlobalRef.popup.eventMenu(...args),
			bubble: (...args) => GlobalRef.popup.eventBubble(...args),
			tooltip: (...args) => GlobalRef.popup.eventTooltip(...args),
		}
		else return {
			menu: () => () => {},
			bubble: () => () => {},
			tooltip: () => () => {},
		}
	}
	// static scope() {
	// 	return { parent:null }
	// }
	static config(opts) {
		if(typeof opts != 'object') return this
		Menu.config(opts)
		for(let key in opts) switch(key) {
			case 'theme':
				const t = opts.theme
				if(typeof t == 'object' && typeof t.colors == 'object' && typeof t.fonts == 'object' && typeof t.roundness == 'number') {
					conf.theme = t
					for(let i in INST) INST[i].themeConfig(t)
				}
				// let isDark = conf.theme.colors.text.replace(/[0-9A-Fa-f]{2}/g, (t)=>(parseInt(t,16)>128?'':'f')) == '#'
				// let isDark = conf.theme.dark
				// let fg = isDark ? 255 : 0, rc = `rgba(${fg},${fg},${fg},${isDark?0.2:0.32})`
				// TouchableNativeFeedback.defaultProps = {
				// 	...TouchableNativeFeedback.defaultProps,
				// 	background: TouchableNativeFeedback.Ripple(rc,false),
				// }
				break;
			case 'scale':
				if(typeof opts.scale == 'number') {
					ss = StyleSheet.create(sso, opts.scale)
					for(let i in INST) INST[i].theming.round = {borderRadius:INST[i].theming.theme.roundness*opts.scale}
					conf.scale = opts.scale
				}
				break;
			case 'button':
				const btn = opts.button
				if(btn.component === false) {
					BTN = defaultBTN
					BTNDeriveProps = defaultBTNDeriveProps
					BTNDeriveStyles = defaultBTNDeriveStyles
				} else {
					if(typeof btn.component == 'function' && typeof btn.component.prototype == 'object') BTN = btn.component
					if(typeof btn.deriveProps == 'function') BTNDeriveProps = btn.deriveProps
					if(typeof btn.deriveTouchableStyles == 'function') BTNDeriveStyles = btn.deriveTouchableStyles
				}
				break;
			case 'press':
				const tap = opts.press
				if(tap.component === false) {
					TCH = defaultTCH
					TCHDeriveProps = defaultTCHeriveProps
					TCHDeriveStyles = defaultTCHDeriveStyles
				} else {
					if(typeof tap.component == 'function' && typeof tap.component.prototype == 'object') TCH = tap.component
					if(typeof tap.deriveProps == 'function') TCHDeriveProps = tap.deriveProps
					if(typeof tap.deriveTouchableStyles == 'function') TCHDeriveStyles = tap.deriveTouchableStyles
				}
				break;
		}
		return this
	}
	// static properties(opts) {
	// 	if(GlobalRef.popup) for(let key in opts) { GlobalRef.props[key] = opts[key] }
	// }
	static showTooltip(begin={},children,anchor='bc',gap=8,style) {
		if(GlobalRef.popup) this.push(this.makeTooltip(begin,children,anchor,gap,style), GlobalRef.popup.configOverrides.Tooltip)
	}
	static showMenu(begin={},items,children,style) {
		if(GlobalRef.popup) this.push(this.makeMenu(begin,items,children,style), GlobalRef.popup.configOverrides.Menu)
	}
	static showList(items,children,style) {
		if(GlobalRef.popup) this.push(this.makeList(items,children,style), GlobalRef.popup.configOverrides.List)
	}
	static showAlert(title,message,label,callback,style) {
		if(GlobalRef.popup) this.push(this.makeAlert(title,message,label,callback,style), GlobalRef.popup.configOverrides.Alert)
	}
	static showQuery(title,message,primaryLabel,primaryAction,secondaryLabel,secondaryAction,style) {
		if(GlobalRef.popup) this.push(this.makeQuery(title,message,primaryLabel,primaryAction,secondaryLabel,secondaryAction,style), GlobalRef.popup.configOverrides.Query)
	}
	static showDialog(children,style) {
		if(GlobalRef.popup) this.push(this.makeDialog(children,style), GlobalRef.popup.configOverrides.Dialog)
	}
	static showBubble(begin={},end={},focus={},children,style) {
		if(GlobalRef.popup) this.push(this.makeBubble(begin,end,focus,children,style), GlobalRef.popup.configOverrides.Bubble)
	}
	static showSnackbar(message,secondLine,label,action,timeOut=4000,style) {
		if(GlobalRef.popup) this.push(this.makeSnackbar(message,secondLine,label,action,timeOut,style), GlobalRef.popup.configOverrides.Snackbar)
	}
	static showToast(children,gravity='b',style) {
		if(GlobalRef.popup) this.push(this.makeToast(children,gravity,style), GlobalRef.popup.configOverrides.Toast)
	}
	static showSheet(title,children,style) {
		if(GlobalRef.popup) this.push(this.makeSheet(title,children,style), GlobalRef.popup.configOverrides.Sheet)
	}
	static push(children, config) {
		if(GlobalRef.popup) GlobalRef.popup.append(children, config)
	}
	static show() {
		if(GlobalRef.popup) GlobalRef.popup.appear()
	}
	static hide() {
		if(GlobalRef.popup) GlobalRef.popup.disappear()
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////
	// static makeAction(children,onPress,style,textStyle) {
	static makeAction = (children,onPress,style,textStyle) => (<Popup.Action {...{children,onPress,style,textStyle}}/>)
	static Action = ({children,onPress,style,textStyle}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let v = [children,onPress]
		return (
			<BTN onPress={(...a)=>self.dismiss()+(typeof v[1] == 'function' ? v[1](...a) : 0)} {...BTNDeriveProps(self)}>
				<View style={[s.of_h,ss.btn,theming.round,BTNDeriveStyles(self),style]}><Text style={[ss.btx,theming.primary,textStyle]} numberOfLines={1} ellipsizeMode="tail">{v[0]||'OK'}</Text></View>
			</BTN>
		)
	}
	// static makeMenuItem(children,onPress,disabled) {
	static makeMenuItem = (children,onPress,disabled) => (<Popup.MenuItem {...{children,onPress,disabled}}/>)
	static MenuItem = ({children,onPress,disabled}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		// console.log(scope)
		let v = [children,onPress,disabled]
		return (
			<MenuItem onPress={(...a)=>self.dismiss()+(typeof v[1] == 'function' ? v[1](...a) : 0)} disabled={v[2]} self={self} theming={theming}>{v[0]}</MenuItem>
		)
	}
	// static makeMenuDivider(style) {
	static makeMenuDivider = (style) => (<Popup.MenuDivider {...{style}} />)
	static MenuDivider = ({style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		return (
			<View style={{backgroundColor:theming.theme.colors.text,opacity:0.1,height:StyleSheet.hairlineWidth,marginHorizontal:0*24,style}}></View>
		)
	}
	// static makeMenu(begin={},items,children,style) {
	static makeMenu = (begin={},items,children,style) => (<Popup.Menu {...{begin,items,children,style}}/>)
	static Menu = ({begin={},items,children,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		// console.log(scope)
		let l = []
		let { width:ww, height:wh } = Dimensions.get('window'),
			bx = Math.max(0,begin.x||0),
			by = Math.max(0,begin.y||0),
			bh = Math.max(0,begin.height||0),
			bw = Math.max(0,begin.width||0),
			po = {},
			top = by+(self.props.offsetTop||0),
			left = bx,
			right = ww-bx-bw,
			bottom = wh-by-bh
		if(top <= wh/2) po.top = top
		else po.bottom = bottom
		if(left <= ww/2) po.left = left
		else po.right = right
		// self.log(po)
		if(children) l = children
		else items.forEach((v,i) => (v.length >= 2 && v != '---')
			? l.push(<Popup.MenuItem onPress={v[1]} disabled={v[2]} key={'I'+i}>{v[0]}</Popup.MenuItem>)
			: v == '---' && i!=0 && i!=(items.length-1)
				? l.push(<Popup.MenuDivider key={'D'+i}/>)
				: ({})
		)
		self.configMerge(self.configOverrides.Menu)
		return (
			<Menu style={[s.pa,po,style]} animationDuration={self.duration} self={self} theming={theming} key={Math.random()}>
				{l}
			</Menu>
		)
	}
	// static makeListItem(children,onPress,disabled,style) {
	static makeListItem = (children,onPress,disabled,style) => (<Popup.ListItem {...{children,onPress,disabled,style}}/>)
	static ListItem = ({children,onPress,disabled,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let v = [children,onPress,disabled]
		return (
			<TCH onPress={(...a)=>self.dismiss()+(typeof v[1] == 'function' ? v[1](...a) : 0)} disabled={v[2]} {...TCHDeriveProps(self)}>
				<View style={[s.tal,ss.lit,style,TCHDeriveStyles(self)]}>
					<Text numberOfLines={1} ellipsizeMode="tail" style={[ss.ltx,theming.text,v[2]?theming.disabled:{}]}>{v[0]}</Text>
				</View>
			</TCH>
		)
	}
	// static makeListDivider(style) {
	static makeListDivider = (style) => (<Popup.ListDivider {...{style}} />)
	static ListDivider = ({style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		return (
			<View style={{backgroundColor:theming.theme.colors.text,opacity:0.1,height:StyleSheet.hairlineWidth,marginHorizontal:0*24,style}}></View>
		)
	}
	// static makeList(items,children,style) {
	static makeList = (items,children,style) => (<Popup.List {...{items,children,style}}/>)
	static List = ({items,children,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let l = [], itms = Array.isArray(items) ? items : []
		let mh = self.height-(48*2)-(self.props.offsetTop||0)
		let ListItem = this.ListItem, ListDivider = this.ListDivider
		if(children) l = children
		else itms.forEach((v,i) => (v.length >= 2 && v != '---')
			? l.push(<ListItem onPress={v[1]} disabled={v[2]} key={'I'+i}>{v[0]}</ListItem>)
			: v == '---' && i!=0 && i!=(items.length-1)
				? l.push(<ListDivider key={'D'+i} />)
				: ({})
		)
		self.configMerge(self.configOverrides.List)
		return (
			// <Animated.ScrollView style={[s.of_h,ss.lsw,theming.round,{maxHeight:self.height-(48*2)-(self.props.offsetTop||0)},theming.surface,self.config.elevate?self.elevateAnimStyle:self.elevateStyle,self.config.fade?self.fadeAnimStyle:{},style]} key={Math.random()}>
			// 	<View style={[ss.lst]}>{l}</View>
			// </Animated.ScrollView>
			<Animated.View style={[ss.lsw,theming.round,theming.surface,self.config.elevate?self.elevateAnimStyle:self.elevateStyle,self.config.fade?self.fadeAnimStyle:{},{maxHeight:mh},style]} key={Math.random()}>
				<Animated.ScrollView style={[s.of_h,ss.lsv]} contentContainerStyle={[s.of_h]}>
					<View style={[ss.lst]}>{l}</View>
				</Animated.ScrollView>
			</Animated.View>
		)
	}
	// static makeAlert(title,message,label,callback,style) {
	static makeAlert = (title,message,label,callback,style) => (<Popup.Alert {...{title,message,label,callback,style}}/>)
	static Alert = ({title,message,label,callback,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let v = [title,message,label,callback]
		self.configMerge(self.configOverrides.Alert)
		return (
			<Animated.View style={[s.of_h,ss.dlg,theming.round,theming.surface,self.config.elevate?self.elevateAnimStyle:self.elevateStyle,self.config.fade?self.fadeAnimStyle:{},self.config.scaling?self.scalingAnimStyle:{},style]} key={Math.random()}>
				{ v[0] && <Text style={[ss.dht,theming.text]}>{v[0]}</Text> }
				<View style={[ss.dpg,v[0]?{}:{marginTop:0}]}><Text style={[ss.dpt,theming.text]}>{v[1]}</Text></View>
				<View style={[s.row,s.justifyEnd,ss.btr]}>
					<BTN onPress={(...a)=>self.dismiss()+(typeof v[3] == 'function' ? v[3](...a) : 0)} {...BTNDeriveProps(self)}>
						<View style={[s.of_h,ss.btn,theming.round,BTNDeriveStyles(self)]}><Text style={[ss.btx,theming.primary]} numberOfLines={1} ellipsizeMode="tail">{v[2]||'OK'}</Text></View>
					</BTN>
				</View>
			</Animated.View>
		)
	}
	// static makeQuery(title,message,primaryLabel,primaryAction,secondaryLabel,secondaryAction,style) {
	static makeQuery = (title,message,primaryLabel,primaryAction,secondaryLabel,secondaryAction,style) => (<Popup.Query {...{title,message,primaryLabel,primaryAction,secondaryLabel,secondaryAction,style}}/>)
	static Query = ({title,message,primaryLabel,primaryAction,secondaryLabel,secondaryAction,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let v = [title,message,primaryLabel,primaryAction,secondaryLabel,secondaryAction]//q ? q : self.props.query
		self.configMerge(self.configOverrides.Query)
		return (
			<Animated.View style={[s.of_h,ss.dlg,theming.round,theming.surface,self.config.elevate?self.elevateAnimStyle:self.elevateStyle,self.config.fade?self.fadeAnimStyle:{},self.config.scaling?self.scalingAnimStyle:{},style]} key={Math.random()}>
				{ v[0] && <Text style={[ss.dht,theming.text]}>{v[0]}</Text> }
				<View style={[ss.dpg,v[0]?{}:{marginTop:0}]}><Text style={[ss.dpt,theming.text]}>{v[1]}</Text></View>
				<View style={[s.row,s.justifyEnd,ss.btr]}>
					<BTN onPress={(...a)=>self.dismiss()+(typeof v[5] == 'function' ? v[5](...a) : 0)} {...BTNDeriveProps(self)}>
						<View style={[s.of_h,ss.btn,theming.round,BTNDeriveStyles(self)]}><Text style={[ss.btx,theming.primary]} numberOfLines={1} ellipsizeMode="tail">{v[4]||'CANCEL'}</Text></View>
					</BTN>
					<BTN onPress={(...a)=>self.dismiss()+(typeof v[3] == 'function' ? v[3](...a) : 0)} {...BTNDeriveProps(self)}>
						<View style={[s.of_h,ss.btn,theming.round,BTNDeriveStyles(self)]}><Text style={[ss.btx,theming.primary]} numberOfLines={1} ellipsizeMode="tail">{v[2]||'OK'}</Text></View>
					</BTN>
				</View>
			</Animated.View>
		)
	}
	// static makeDialog(children,style) {
	static makeDialog = (children,style) => (<Popup.Dialog {...{children,style}}/>)
	static Dialog = ({children,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		self.configMerge(self.configOverrides.Dialog)
		return (
			<Animated.View style={[s.of_h,ss.dlg,theming.round,theming.surface,self.config.elevate?self.elevateAnimStyle:self.elevateStyle,self.config.fade?self.fadeAnimStyle:{},self.config.scaling?self.scalingAnimStyle:{},{paddingTop:8,padding:8},style]} key={Math.random()}>
				{ children }
			</Animated.View>
		)
	}
	// static makeSnackbar(message,secondLine,label,action,timeOut=4000,style) {
	static makeSnackbar = (message,secondLine,label,action,timeOut=4000,style) => (<Popup.Snackbar {...{message,secondLine,label,action,timeOut,style}}/>)
	static Snackbar = ({message,secondLine,label,action,timeOut=4000,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let v = [message,secondLine,label,action]
		let b = v[2].trim().length > 10 || v[2].trim().split(/\s/).length > 1
		let flattened = StyleSheet.flatten([{ color: (theming.theme.dark ? SBC.d : SBC.l) }, style])
		let color = flattened.color
		let wrapStyl = { backgroundColor: (theming.theme.dark ? SBB.d : SBB.l) }
		let textStyl = { fontFamily:theming.theme.fonts.regular, color }
		self.configMerge({...self.configOverrides.Snackbar,...(typeof timeOut == 'number' ? {autohide:timeOut} : {})})
		return (
			<Animated.View style={[s.of_h,ss.sbp,theming.round,wrapStyl,self.config.elevate?self.elevateAnimStyle:self.elevateStyle,self.config.fade?self.fadeAnimStyle:{},self.config.scaling?self.scalingAnimStyle:{},!b?{}:{flexDirection:'column'},style]} key={Math.random()}>
				<View style={[ss.sbg,!b?{marginRight:-8}:{marginTop:8,width:'100%'}]}>
					<View style={ss.sbt}><Text style={[ss.sbx,textStyl]}>{v[0]}</Text></View>
					{ v[1] && <View style={ss.sbt}><Text style={[ss.sbx,textStyl]}>{v[1]}</Text></View> }
				</View>
				<View style={[s.row,s.justifyEnd,!b?{}:{marginTop:6,marginBottom:2,alignSelf:'flex-end'}]}>
					<BTN onPress={(...a)=>self.dismiss()+(typeof v[3] == 'function' ? v[3](...a) : 0)} {...BTNDeriveProps(self)}>
						<View style={[s.of_h,ss.btn,theming.round,BTNDeriveStyles(self)]}><Text style={[ss.btx,theming.accent]} numberOfLines={1} ellipsizeMode="tail">{v[2]}</Text></View>
					</BTN>
				</View>
			</Animated.View>
		)
	}
	// static makeSheet(title,children,style) {
	static makeSheet = (title,children,style) => (<Popup.Sheet {...{title,children,style}}/>)
	static Sheet = ({title,children,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let elevStyl = self.config.elevate ? Elevations.interpolate(self.anim, {inputRange:[0,0.25,1],outputRange:[0,0,16]}) : Elevations[16]
		let wrapStyl = {
			backgroundColor: theming.theme.colors.surface,
			bottom: self.anim.interpolate({inputRange:[0,0.25,1],outputRange:['-60%','-40%','0%']}),
			maxHeight: self.height/2,
		}
		let contStyl = { maxHeight: self.height/2 - (!!title?54:0) }
		self.configMerge(self.configOverrides.Sheet)
		return (
			<Animated.View style={[s.pa,s.col,ss.shw,wrapStyl,elevStyl,style]} key={Math.random()}>
				{ !!title && <View key={'ttl'} style={[ss.shh,Elevations[0]]}><Text style={[ss.sht,theming.text]}>{ title }</Text></View> }
				<View key={'con'} style={[ss.shc,Elevations[0],contStyl]}>{ children }</View>
			</Animated.View>
		)
	}
	// static makeToast(children,gravity='b',style) {
	static makeToast = (children,gravity='b',style) => (<Popup.Toast {...{children,gravity,style}}/>)
	static Toast = ({children,gravity='b',style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let { width:ww, height:wh } = Dimensions.get('window'),
			an = gravity.toLowerCase(),
			top = (TS[an[0]]*wh)+(self.props.offsetTop||0)
		let flattened = StyleSheet.flatten([{color: (theming.theme.dark ? TSC.d : TSC.l)}, style])
		let color = flattened.color
		let timeline = [0,0.5,1]
		let wrapStyl = {
			top,
			// backgroundColor: '#f00',
		}
		let viewStyl = {
			backgroundColor: theming.theme.dark ? TSB.d : TSB.l,
			opacity: self.config.fade?self.anim.interpolate({inputRange:timeline,outputRange:[0,1,1]}):1,
			// transform: [{scale:self.anim.interpolate({inputRange:timeline,outputRange:[0.7,0.85,1]})}],
		}
		let textStyl = { fontFamily:theming.theme.fonts.regular, color }
		self.configMerge(self.configOverrides.Toast)
		return (
			<Animated.View style={[s.of_v,s.pa,s.col,ss.tsw,wrapStyl]} key={Math.random()}>
				<Animated.View style={[s.of_h,s.pa,ss.tsv,viewStyl,style]}>
					<Text style={[ss.tst,textStyl]} numberOfLines={16} ellipsizeMode={'tail'}>{ children }</Text>
				</Animated.View>
			</Animated.View>
		)
	}
	// static makeBubble(begin={},end={},focus={},children,style) {
	static makeBubble = (begin={},end={},focus={},children,style) => (<Popup.Bubble {...{begin,end,focus,children,style}}/>)
	static Bubble = ({begin={},end={},focus={},children,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		// self.log('BUBBLE', Dimensions.get('window').height, Dimensions.get('screen').height, StatusBar.currentHeight);
		let { width:ww, height:wh } = Dimensions.get('window')
		let bx = typeof begin.x == 'number' ? begin.x : ww/2,
			by = typeof begin.y == 'number' ? begin.y : wh/2,
			bh = typeof begin.r == 'number' ? begin.r * 2 : Math.max(0,begin.height||0),
			bw = typeof begin.r == 'number' ? begin.r * 2 : Math.max(0,begin.width||0),
			bm = typeof begin.r == 'number' ? begin.r * 2 : Math.min(bw,bh),
			height = Math.min(wh, Math.max(0,end.height||bh)),
			width = Math.min(ww, Math.max(0,end.width||bw)),
			x = typeof end.x == 'number' ? end.x : (ww - width)/2,
			y = typeof end.y == 'number' ? end.y : (wh - height)/2,
			fx = typeof focus.x == 'number' ? focus.x : 0,
			fy = typeof focus.y == 'number' ? focus.y : 0,
			// fh = typeof focus.height == 'number' ? focus.height : 2 * Math.min(cy,height-cy),
			// fw = typeof focus.width == 'number' ? focus.width : 2 * Math.min(cx,width-cx),
			fh = typeof focus.height == 'number' ? focus.height : height,
			fw = typeof focus.width == 'number' ? focus.width : width,
			fm = typeof focus.r == 'number' ? focus.r * 2 : Math.min(fw,fh),
			sx = bw/fw,
			sy = bh/fh,
			sc = bm/fm,
			cx = fx+fw/2,
			cy = fy+fh/2,
			dx = width/2-cx,
			dy = height/2-cy,
			x1 = bx+bw/2,
			y1 = by+bh/2,
			x2 = x+fx+fw/2,
			y2 = y+fy+fh/2,
			ix = -(width-2*dx*sx-bw)/2,
			iy = -(height-2*dy*sy-bh)/2,
			jx = -cx+fw/2,
			jy = -cy+fh/2,
			ax = x+cx-fw/2,
			ay = y+cy-fh/2,
			// ix = -(width-2*dx*sc-bw)/2,
			// iy = -(height-2*dy*sc-bh)/2,
			// jx = -cx+fm/2,
			// jy = -cy+fm/2,
			// ax = x+cx-fm/2,
			// ay = y+cy-fm/2,
			r = 1 + Math.max(
				Math.sqrt(Math.pow(width-cx,2)+Math.pow(height-cy,2)),
				Math.sqrt(Math.pow(0-cx,2)+Math.pow(0-cy,2)),
				Math.sqrt(Math.pow(0-cx,2)+Math.pow(height-cy,2)),
				Math.sqrt(Math.pow(width-cx,2)+Math.pow(0-cy,2))
			)
		ay += (self.props.offsetTop||0)
		by += (self.props.offsetTop||0)
		y += (self.props.offsetTop||0)
		// self.log({height,width,x,y,bx,by,bh,bw,cx,cy,bm,fm,sc,r})
		// self.log({height,width,x,y,cx,cy,bm,fm,sc})
		let timeline = [0,0.4,0.799,0.8,1]
		let elvt = Elevations.interpolate(self.anim, {inputRange:timeline,outputRange:[0,0,0,0,24]})
		// let elvt = Platform.OS == 'android'
		// 	? {elevation:self.anim.interpolate({inputRange:timeline,outputRange:[0,0,0,0,24]})}
		// 	: Elevations[24]
		let inp = Arc0
		let out = Arc3.map(v=>v*(x1-x2)*(y2-y1)/Math.abs(y2-y1))
		let wrapStyl = {
			// overflow:'visible',
			borderRadius:self.anim.interpolate({inputRange:timeline,outputRange:[r,r,r,0,0]}),
			// height:self.anim.interpolate({inputRange:timeline,outputRange:[bm,fm,r*2,wh,wh]}),
			// width:self.anim.interpolate({inputRange:timeline,outputRange:[bm,fm,r*2,ww,ww]}),
			height:self.anim.interpolate({inputRange:timeline,outputRange:[bh,fh,r*2,wh,wh]}),
			width:self.anim.interpolate({inputRange:timeline,outputRange:[bw,fw,r*2,ww,ww]}),
			left:self.anim.interpolate({inputRange:timeline,outputRange:[bx,ax,x+cx-r,0,0]}),
			top:self.anim.interpolate({inputRange:timeline,outputRange:[by,ay,y+cy-r,0,0]}),
			// translateX:self.anim.interpolate({inputRange:timeline,outputRange:[0,x+width/2-bx-fm/2,0,0]}),
			// translateY:self.anim.interpolate({inputRange:timeline,outputRange:[0,y+height/2-by-fm/2,0,0]}),
			transform: [
				{translateX:self.anim.interpolate({inputRange:inp,outputRange:out})},
				// {translateX:self.anim.interpolate({inputRange:[0,0.25,0.4,1],outputRange:[0,50,0,0]})},
				// {translateY:self.anim.interpolate({inputRange:[0,0.25,0.4,1],outputRange:[0,50,0,0]})}
			],
			// backgroundColor:'#fff0'
			zIndex:11,
		}
		let viewStyl = {
			// borderRadius:4,
			// opacity:0.6,
			height,
			width,
			left:self.anim.interpolate({inputRange:timeline,outputRange:[ix,jx,r-cx,x,x]}),
			top:self.anim.interpolate({inputRange:timeline,outputRange:[iy,jy,r-cy,y,y]}),
			transform:[{scale:self.anim.interpolate({inputRange:timeline,outputRange:[sc,1,1,1,1]})}],
			overflow:'visible',
			...elvt
		}
		self.configMerge(self.configOverrides.Bubble)
		return (
			<Animated.View style={[s.of_h,s.pa,wrapStyl]} key={Math.random()}>
				<TouchableWithoutFeedback onPress={self.onBackdropPress}>
					<View style={[s.pa,s.tl,s.wrap]}></View>
				</TouchableWithoutFeedback>
				<Animated.View style={[s.of_h,s.pa,theming.round,viewStyl,style]}>
					{ children }
				</Animated.View>
			</Animated.View>
		)
	}
	// static makeTooltip(begin={},children,anchor='bc',gap=8,style) {
	static makeTooltip = (begin={},children,anchor='bc',gap=8,style) => (<Popup.Tooltip {...{begin,children,anchor,gap,style}}/>)
	static Tooltip = ({begin={},children,anchor='bc',gap=8,style}) => {
		let scope = useContext(PopupContext)
		let self = scope.parent//this//
		let theming = self.theming
		let { width:ww, height:wh } = Dimensions.get('window'),
			bx = typeof begin.x == 'number' ? begin.x : ww/2,
			by = typeof begin.y == 'number' ? begin.y : wh/2,
			bh = typeof begin.r == 'number' ? begin.r * 2 : Math.max(0,begin.height||0),
			bw = typeof begin.r == 'number' ? begin.r * 2 : Math.max(0,begin.width||0),
			an = anchor.toLowerCase().split(''),
			alignItems = AV[an[0]],
			justifyContent = AH[an[1]],
			top = (by-gap)+(bh+gap*2)*GV[an[0]]+(self.props.offsetTop||0),
			left = (bx-gap)+(bw+gap*2)*GH[an[1]]
		let flattened = StyleSheet.flatten([{color: (theming.theme.dark ? TPC.d : TPC.l)}, style])
		let color = flattened.color
		let timeline = [0,0.5,1]
		let wrapStyl = {
			top,
			left,
			alignItems,
			justifyContent,
			// backgroundColor: '#f00',
		}
		let viewStyl = {
			color,
			backgroundColor: theming.theme.dark ? TPB.d : TPB.l,
			opacity: self.config.fade?self.anim.interpolate({inputRange:timeline,outputRange:[0,1,1]}):1,
			transform: self.config.scaling?[{scale:self.anim.interpolate({inputRange:timeline,outputRange:[0.7,0.85,1]})}]:[],
		}
		let textStyl = { fontFamily:theming.theme.fonts.regular, color }
		self.configMerge(self.configOverrides.Tooltip)
		return (
			<Animated.View style={[s.of_v,s.pa,s.row,ss.tpw,wrapStyl]} key={Math.random()}>
				<Animated.View style={[s.of_h,s.pa,ss.tpv,theming.round,viewStyl,style]}>
					{ typeof children == 'string'
						? <Text style={[ss.tpt,textStyl]}>{ children }</Text>
						: <View style={[ss.tpt]}>{ children }</View>
					}
				</Animated.View>
			</Animated.View>
		)
	}
	eventTooltip(cfg,children,anchor,gap) {
		return (e) => {
			UIManager.measureInWindow(e.nativeEvent.target, (x, y, width, height) => {
				let begin = {x, y:y+StatusBar.currentHeight, width, height}
				this.append(Popup.makeTooltip(begin,children,anchor,gap), cfg)
			})
		}
	}
	eventMenu(cfg,items,style) {
		return (e) => {
			// this.log('MENU EVENT')
			UIManager.measureInWindow(e.nativeEvent.target, (x, y, width, height) => {
				let begin = {x, y:y+StatusBar.currentHeight, width, height}
				this.append(Popup.makeMenu(items,begin,style), cfg)
			})
		}
	}
	eventBubble(cfg,end,focus,children,style) {
		return (e) => {
			UIManager.measureInWindow(e.nativeEvent.target, (x, y, width, height) => {
				let begin = {x, y:y+StatusBar.currentHeight, width, height}
				this.append(Popup.makeBubble(begin,end,focus,children,style), cfg)
			})
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////
	onBackdropPress = (e) => {
		if(this.config.backdropDismiss && !this.animating) this.dismiss()
	}
	onLayout = (e) => {
		let { width, height } = e.nativeEvent.layout;
		// console.log('LAYOUT', { width, height });
		if(height > 99) this.height = height
		if(width > 99) this.width = width
	}
	handleBackPress = (e) => {
		if(this.visible) {
			this.backAction()
			return true;
		}
		return false;// means, go back.
	}
	backAction = () => {
		this.disappear()
	}
	timerCallback = () => {
		// console.log('TIMER CB')
		if(this.timerStopped) return
		if(this.animating) return this.rerender()
		this.timer.setValue(0)
		this.disappear()
	}
	constructor(props) {
		super(props)
		// this.log('POP!', props)
		// this.anim.addListener((v)=>{
		// 	if(v.value == 0) this.contents = null
		// 	if(v.value*100%10<1) this.log(v)
		// })
		this.id = 'POP'+(1E9*Math.random()).toFixed(0)
		INST[this.id] = this
	}
	componentWillReceiveProps(props) {//static getDerivedStateFromProps = (props, oldState) {//
		this.applyProps(props)
	}
	componentDidMount() {
		if(this.props.global === true) GlobalRef.popup = this
		// this.log(`POP props:`,this.props)
		this.backHandler = RN.BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
		this.applyProps(this.props)
	}
	componentWillUnmount() {
		// if(typeof this.props.scope == 'object') this.props.scope.parent = this
		if(this.props.global === true && GlobalRef.popup === this) GlobalRef.popup = null
		this.backHandler.remove()
		delete INST[this.id]
	}
	// componentWillMount() {}
	// shouldComponentUpdate(nextProps, nextState) {}
	dismiss(cb) {
		// setTimeout(() => {
		// 	this.disappear()
		// }, 100)
		this.timerStopped = true
		this.timer.stopAnimation()
		Animated.timing(this.timer, {duration:100,toValue:1}).start(() => {
			// console.log('DISMISS TIMER')
			this.timerStopped = false
			this.timer.setValue(0)
			this.disappear(cb)
		})
	}
	property(key,val) {
		this.defaults[key] = val
		this.config[key] = val
	}
	themeConfig(t, fix) {
		if(this.themeFixed && typeof fix != 'boolean') return
		if(typeof t.colors == 'object' && typeof t.fonts == 'object' && typeof t.roundness == 'number') {
			this.configOverrides.themeConfig(t)
			this.theming.theme = t
			this.theming.text = {fontFamily:t.fonts.regular,color:t.colors.text}
			this.theming.accent = {fontFamily:t.fonts.regular,color:t.colors.accent}
			this.theming.primary = {fontFamily:t.fonts.regular,color:t.colors.primary}
			this.theming.surface = {backgroundColor:t.colors.surface}
			this.theming.disabled = {color:t.colors.disabled}
			this.theming.round = {borderRadius:t.roundness*conf.scale}
			this.themeFixed = !!fix
		}
	}
	applyProps(props) {
		// this.log('applyProps',props)
		if(typeof props.duration == 'number') this.duration = props.duration
		if(typeof props.strech == 'number') this.property('strech', props.strech)
		if(typeof props.fade == 'boolean') this.property('fade', props.fade)
		if(typeof props.scaling == 'boolean') this.property('scaling', props.scaling)
		if(typeof props.elevate == 'boolean') this.property('elevate', props.elevate)
		if(typeof props.reverse == 'boolean') this.property('reverse', props.reverse)
		if(typeof props.autohide == 'number') this.property('autohide', props.autohide)
		if(typeof props.hovering == 'boolean') this.property('hovering', props.hovering)
		if(typeof props.floating == 'boolean') this.property('floating', props.floating)
		if(typeof props.backdropColor == 'boolean') this.property('backdropColor', props.backdropColor)
		if(typeof props.backdropDismiss == 'boolean') this.property('backdropDismiss', props.backdropDismiss)
		// if(typeof props.onDismiss == 'function') this.property('onDismiss', props.onDismiss)
		if(typeof props.children != 'undefined' && this.contents !== props.children) this.append(props.children)
		if(typeof props.theme == 'object' && typeof props.theme.colors == 'object' && typeof props.theme.fonts == 'object' && typeof props.theme.roundness == 'number') this.themeConfig(props.theme, true)
		else if(props.theme === null) this.themeConfig(conf.theme, false)
	}
	configMerge(cfg) {
		if(typeof cfg != 'object') return this
		this.config.onDismiss = (typeof cfg.onDismiss == "function" && !this.props.onDismiss) ? cfg.onDismiss : this.config.onDismiss
		this.config.backdropDismiss = (typeof cfg.backdropDismiss == "boolean" && !this.props.backdropDismiss) ? cfg.backdropDismiss : this.config.backdropDismiss
		this.config.backdropColor = (typeof cfg.backdropColor == "string" && !this.props.backdropColor) ? cfg.backdropColor : this.config.backdropColor
		this.config.strech = (typeof cfg.strech == "number" && !this.props.strech) ? cfg.strech : this.config.strech
		this.config.autohide = (typeof cfg.autohide == "number" && !this.props.autohide) ? cfg.autohide : this.config.autohide
		this.config.hovering = (typeof cfg.hovering == "boolean" && !this.props.hovering) ? cfg.hovering : this.config.hovering
		this.config.floating = (typeof cfg.floating == "boolean" && !this.props.floating) ? cfg.floating : this.config.floating
		this.config.reverse = (typeof cfg.reverse == "boolean" && !this.props.reverse) ? cfg.reverse : this.config.reverse
		this.config.elevate = (typeof cfg.elevate == "boolean" && !this.props.elevate) ? cfg.elevate : this.config.elevate
		this.config.scaling = (typeof cfg.scaling == "boolean" && !this.props.scaling) ? cfg.scaling : this.config.scaling
		this.config.fade = (typeof cfg.fade == "boolean" && !this.props.fade) ? cfg.fade : this.config.fade
		this.rerender()
		return this
	}
	configSetup(cfg) {
		if(typeof cfg != 'object') return this
		this.config.onDismiss = (typeof cfg.onDismiss == "function") ? cfg.onDismiss : this.defaults.onDismiss
		this.config.backdropDismiss = (typeof cfg.backdropDismiss == "boolean") ? cfg.backdropDismiss : this.defaults.backdropDismiss
		this.config.backdropColor = (typeof cfg.backdropColor == "string") ? cfg.backdropColor : this.defaults.backdropColor
		this.config.strech = (typeof cfg.strech == "number") ? cfg.strech : this.defaults.strech
		this.config.autohide = (typeof cfg.autohide == "number") ? cfg.autohide : this.defaults.autohide
		this.config.hovering = (typeof cfg.hovering == "boolean") ? cfg.hovering : this.defaults.hovering
		this.config.floating = (typeof cfg.floating == "boolean") ? cfg.floating : this.defaults.floating
		this.config.reverse = (typeof cfg.reverse == "boolean") ? cfg.reverse : this.defaults.reverse
		this.config.elevate = (typeof cfg.elevate == "boolean") ? cfg.elevate : this.defaults.elevate
		this.config.scaling = (typeof cfg.scaling == "boolean") ? cfg.scaling : this.defaults.scaling
		this.config.fade = (typeof cfg.fade == "boolean") ? cfg.fade : this.defaults.fade
		return this
	}
	configReset() {
		this.config.onDismiss = this.defaults.onDismiss
		this.config.backdropDismiss = this.defaults.backdropDismiss
		this.config.backdropColor = this.defaults.backdropColor
		this.config.strech = this.defaults.strech
		this.config.autohide = this.defaults.autohide
		this.config.hovering = this.defaults.hovering
		this.config.floating = this.defaults.floating
		this.config.reverse = this.defaults.reverse
		this.config.elevate = this.defaults.elevate
		this.config.scaling = this.defaults.scaling
		this.config.fade = this.defaults.fade
		return this
	}
	append(children,cfg) {
		if(this.contents) {
			// console.log('HAS CONTENTS')
			this.dismiss(() => {
				// console.log('HAS DISMISSED')
				this.append(children,cfg)
			})
		} else {
			this.configSetup(cfg)
			this.contents = children
			this.appear()
		}
	}
	appear() {
		if(this.animating) return
		// console.log(this.config)
		this.visible = true
		this.animating = true
		this.timerStopped = true
		this.timer.stopAnimation()
		// LayoutAnimation.configureNext(LayoutAnimation.create(this.duration, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity))
		let anim = Animated.timing(this.anim, {easing:StandardCurve,duration:1*this.duration*this.config.strech,toValue:1})
		anim.start(x=>{
			this.animating = false
			this.timerStopped = false
			if(this.config.autohide > 0) {
				Animated.timing(this.timer, {duration:this.config.autohide*this.config.strech,toValue:1}).start(this.timerCallback)
			}
		})
		this.rerender()
	}
	disappear(cb) {
		// console.log('ANIMATING:',this.animating)
		if(this.animating) return
		if(!this.config.reverse) this.visible = false
		this.animating = true
		// LayoutAnimation.configureNext(LayoutAnimation.create(this.duration, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity))
		let anim = Animated.timing(this.anim, {easing:StandardCurve,duration:1*this.duration*0.8*this.config.strech,toValue:0})
		anim.start(x=>{
			this.anim.setValue(0)
			this.config.onDismiss(this)
			if(typeof this.props.onDismiss == 'function') this.props.onDismiss(this)
			this.configReset()
			this.timerStopped = false
			this.animating = false
			this.contents = null
			this.visible = false
			this.rerender()
			if(typeof cb == 'function') cb(this)
		})
		this.rerender()
	}
	render() {
		// if(typeof this.props.scope == 'object') this.props.scope.parent = this
		const style = { paddingTop:1*(this.props.offsetTop||0) }
		const backStyle = {height:'150%'}
		if(this.config.hovering || this.config.floating) {
			style.height = 0
			style.overflow = 'visible'
			style.bottom = this.config.floating ? 0 : undefined
			backStyle.height = 0
		}
		return (//
			<Provider value={this.state}>{ this.visible ? <Animated.View onLayout={this.onLayout} style={[s.pa,s.wrap,s.col,s.flexCenter,style,this.props.style]}>
				<TouchableWithoutFeedback onPress={this.onBackdropPress}>
					<Animated.View style={[s.pa,s.tl,s.wrap,Elevations[0],{backgroundColor:this.config.backdropColor},backStyle,this.config.fade?this.backFadeAnimStyle:{opacity:0}]}></Animated.View>
				</TouchableWithoutFeedback>
				{ this.contents }
			</Animated.View> : <View style={[s.pa]}></View> }</Provider>
		)//
	}
}

module.exports = Popup