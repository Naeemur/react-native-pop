const React = require('react');
const PropTypes = require('prop-types');
const Elevations = require('react-native-elevation');
const { Comp, Compact, TouchableNativeFeedback } = require('react-native-comp-util')

const {
	Component
} = React

const {
	Animated,
	Dimensions,
	Easing,
	Modal,
	Platform,
	StatusBar,
	// StyleSheet,
	Text,
	TouchableHighlight,
	TouchableWithoutFeedback,
	View,
	// ViewPropTypes,
	I18nManager,
} = require('react-native');
const { StyleSheet, Scaling } = require('react-native-scaling')

const STATES = {
	HIDDEN: 'HIDDEN',
	ANIMATING: 'ANIMATING',
	SHOWN: 'SHOWN',
};

const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

const styles = StyleSheet.create({
	shadowMenuContainer: {
		position: 'absolute',
		// backgroundColor: 'white',
		borderRadius: 4,
		opacity: 0,
		// Shadow
		// ...Platform.select({
		// 	ios: {
		// 		shadowColor: 'black',
		// 		shadowOffset: { width: 0, height: 2 },
		// 		shadowOpacity: 0.14,
		// 		shadowRadius: 2,
		// 	},
		// 	android: {
		// 		elevation: 8,
		// 	},
		// }),
		...Elevations[8]
	},
	menuContainer: {
		overflow: 'hidden',
	},
});

class MenuWrapper extends Component {
	_container = null;

	state = {
		menuState: STATES.HIDDEN,

		top: 0,
		left: 0,

		menuWidth: 0,
		menuHeight: 0,

		buttonWidth: 0,
		buttonHeight: 0,

		menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
		opacityAnimation: new Animated.Value(0),
	};

	_setContainerRef = ref => {
		this._container = ref;
	};

	// Start menu animation
	_onMenuLayout = e => {
		if (this.state.menuState === STATES.ANIMATING) {
			return;
		}

		const { width, height } = e.nativeEvent.layout;

		this.setState(
			{
				menuState: STATES.ANIMATING,
				menuWidth: width,
				menuHeight: height,
			},
			() => {
				Animated.parallel([
					Animated.timing(this.state.menuSizeAnimation, {
						toValue: { x: width, y: height },
						duration: this.props.animationDuration,
						easing: EASING,
					}),
					Animated.timing(this.state.opacityAnimation, {
						toValue: 1,
						duration: this.props.animationDuration,
						easing: EASING,
					}),
				]).start();
			},
		);
	};

	_onDismiss = () => {
		if (this.props.onHidden) {
			this.props.onHidden();
		}
	};

	show = () => {
		this._container.measureInWindow((left, top, buttonWidth, buttonHeight) => {
			this.setState({
				buttonHeight,
				buttonWidth,
				left,
				menuState: STATES.SHOWN,
				top,
			});
		});
	};

	hide = onHidden => {
		Animated.timing(this.state.opacityAnimation, {
			toValue: 0,
			duration: this.props.animationDuration,
			easing: EASING,
		}).start(() => {
			// Reset state
			this.setState(
				{
					menuState: STATES.HIDDEN,
					menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
					opacityAnimation: new Animated.Value(0),
				},
				() => {
					if (onHidden) {
						onHidden();
					}

					// Invoke onHidden callback if defined
					if (Platform.OS !== 'ios' && this.props.onHidden) {
						this.props.onHidden();
					}
				},
			);
		});
	};

	// @@ TODO: Rework this
	_hide = () => {
		this.hide();
	};

	render() {
		const { isRTL } = I18nManager;

		const dimensions = Dimensions.get('window');
		const { width: windowWidth } = dimensions;
		const windowHeight = dimensions.height - (StatusBar.currentHeight || 0);

		const {
			menuSizeAnimation,
			menuWidth,
			menuHeight,
			buttonWidth,
			buttonHeight,
			opacityAnimation,
		} = this.state;
		const menuSize = {
			width: menuSizeAnimation.x,
			height: menuSizeAnimation.y,
		};

		// Adjust position of menu
		let { left, top } = this.state;
		const transforms = [];

		if (
			(isRTL && left + buttonWidth - menuWidth > SCREEN_INDENT) ||
			(!isRTL && left + menuWidth > windowWidth - SCREEN_INDENT)
		) {
			transforms.push({
				translateX: Animated.multiply(menuSizeAnimation.x, -1),
			});

			left = Math.min(windowWidth - SCREEN_INDENT, left + buttonWidth);
		} else if (left < SCREEN_INDENT) {
			left = SCREEN_INDENT;
		}

		// Flip by Y axis if menu hits bottom screen border
		if (top > windowHeight - menuHeight - SCREEN_INDENT) {
			transforms.push({
				translateY: Animated.multiply(menuSizeAnimation.y, -1),
			});

			top = windowHeight - SCREEN_INDENT;
			top = Math.min(windowHeight - SCREEN_INDENT, top + buttonHeight);
		} else if (top < SCREEN_INDENT) {
			top = SCREEN_INDENT;
		}

		const shadowMenuContainerStyle = {
			opacity: opacityAnimation,
			transform: transforms,
			top,

			// Switch left to right for rtl devices
			...(isRTL ? { right: left } : { left }),
		};

		const { menuState } = this.state;
		const animationStarted = menuState === STATES.ANIMATING;
		const modalVisible = menuState === STATES.SHOWN || animationStarted;

		const { testID, button, style, children, theming } = this.props;

		return (
			<View ref={this._setContainerRef} collapsable={false} testID={testID}>
				<View>{button}</View>

				<Modal
					visible={modalVisible}
					onRequestClose={this._hide}
					supportedOrientations={[
						'portrait',
						'portrait-upside-down',
						'landscape',
						'landscape-left',
						'landscape-right',
					]}
					transparent
					onDismiss={this._onDismiss}
				>
					<TouchableWithoutFeedback onPress={this._hide} accessible={false}>
						<View style={StyleSheet.absoluteFill}>
							<Animated.View
								onLayout={this._onMenuLayout}
								style={[
									theming.surface,
									styles.shadowMenuContainer,
									shadowMenuContainerStyle,
									style,
								]}
							>
								<Animated.View
									style={[styles.menuContainer, animationStarted && menuSize]}
								>
									{children}
								</Animated.View>
							</Animated.View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		);
	}
}

MenuWrapper.propTypes = {
	animationDuration: PropTypes.number,
	button: PropTypes.node.isRequired,
	children: PropTypes.node.isRequired,
	onHidden: PropTypes.func,
	// style: ViewPropTypes.style,
	// testID: ViewPropTypes.testID,
};

MenuWrapper.defaultProps = {
	animationDuration: 300,
};

/// divider

const dvdrStyles = StyleSheet.create({
	divider: {
		flex: 1,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
});

function MenuDivider({ color, theming }) {
	return <View style={[dvdrStyles.divider, { borderBottomColor: color || theming.theme.colors.placeholder }]} />;
}

MenuDivider.defaultProps = {
	// color: 'rgba(0,0,0,0.12)',
};

MenuDivider.propTypes = {
	color: PropTypes.string,
};

/// menuitem

const iso ={
	container: {
		height: 48,
		justifyContent: 'center',
		maxWidth: 248,
		minWidth: 124,
	},
	title: {
		fontSize: 14,
		fontWeight: '400',
		paddingHorizontal: 16,
		textAlign: 'left',
	},
}

let itemStyles = StyleSheet.create(iso);

function MenuItem({
	children,
	disabled,
	disabledTextColor,
	ellipsizeMode,
	onPress,
	style,
	textStyle,
	theming,
	self,
	...props
}) {
	// console.log('MENU ITEM >>',disabled,disabledTextColor,textStyle)
	const touchableProps = {}
		// Platform.OS === 'android'
		// 	? { background: TouchableNativeFeedback.SelectableBackground() }
		// 	: {};

	return (
		<TCH
			disabled={disabled}
			onPress={onPress}
			{...touchableProps}
			{...props}
			{...TCHDeriveProps(self)}
		>
			<View style={[itemStyles.container, style, TCHDeriveStyles(self)]}>
				<Text
					ellipsizeMode={ellipsizeMode}
					numberOfLines={1}
					style={[
						theming.text,
						itemStyles.title,
						disabled && { color: disabledTextColor || theming.theme.colors.disabled },
						textStyle,
					]}
				>
					{children}
				</Text>
			</View>
		</TCH>
	);
}

MenuItem.propTypes = {
	children: PropTypes.node.isRequired,
	disabled: PropTypes.bool,
	disabledTextColor: PropTypes.string,
	ellipsizeMode: PropTypes.string,
	onPress: PropTypes.func,
	// style: TouchableHighlight.propTypes.style,
	// textStyle: Text.propTypes.style,
	// underlayColor: TouchableHighlight.propTypes.underlayColor,
};

MenuItem.defaultProps = {
	disabled: false,
	// disabledTextColor: '#bdbdbd',
	ellipsizeMode: Platform.OS === 'ios' ? 'clip' : 'tail',
	underlayColor: '#e0e0e0',
};

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

let TCH = defaultTCH
let TCHDeriveProps = defaultTCHDeriveProps
let TCHDeriveStyles = defaultTCHDeriveStyles

class Menu extends Component {
	menuSizeAnimation = new Animated.ValueXY({ x: 0, y: 0 })
	opacityAnimation = new Animated.Value(0)
	animationStarted = false
	_onMenuLayout = (e) => {
		if(this.animationStarted) return;
		const { width, height } = e.nativeEvent.layout;
		// console.log({ width, height });
		this.menuSizeAnimation.setValue({ x: 0, y: 0 })
		this.opacityAnimation.setValue(0)
		this.animationStarted = true;
		Animated.parallel([
			Animated.timing(this.menuSizeAnimation, {
				toValue: { x: width, y: height },
				duration: this.props.animationDuration||200,
				easing: EASING,
			}),
			Animated.timing(this.opacityAnimation, {
				toValue: 1,
				duration: this.props.animationDuration||200,
				easing: EASING,
			}),
		]).start();
		this.forceUpdate();
	}
	static config(opts) {
		if(typeof opts != 'object') return this
		for(let key in opts) switch(key) {
			// case 'theme':
			// 	if(typeof opts[key] == 'object') conf[key] = opts[key]
			// 	break;
			case 'scale':
				if(typeof opts.scale == 'number') itemStyles = StyleSheet.create(iso, opts.scale)
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
	render() {
		const { testID, button, style, children, theming } = this.props;
		const { isRTL } = I18nManager;
		const shadowMenuContainer = {
			// position: 'absolute',
			// backgroundColor: 'white',
			// opacity: 0,
			// Shadow
			// ...Platform.select({
			// 	ios: {
			// 		shadowColor: 'black',
			// 		shadowOffset: { width: 0, height: 2 },
			// 		shadowOpacity: 0.14,
			// 		shadowRadius: 2,
			// 	},
			// 	android: {
			// 		elevation: 8,
			// 	},
			// }),
			// borderRadius: 4,
			// ...Elevations[8]
			overflow: 'visible'
		};
		const shadowMenuContainerStyle = {
			opacity: this.opacityAnimation,
			// position: 'absolute',
			// right: SCREEN_INDENT,
			// top: SCREEN_INDENT,
		};
		const menuSize = {
			width: this.menuSizeAnimation.x,
			height: this.menuSizeAnimation.y,
			overflow: 'hidden'
		};
		return (
			<Animated.View
				onLayout={this._onMenuLayout}
				style={[
					theming.round,
					theming.surface,
					shadowMenuContainer,
					shadowMenuContainerStyle,
					Elevations[8],
					style,
				]}
			>
				<Animated.View
					style={[styles.menuContainer, theming.round, this.animationStarted && menuSize]}
				>
					{children}
				</Animated.View>
			</Animated.View>
		)
	}
}

let conf = {
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

export { MenuWrapper, MenuItem, MenuDivider, Menu };
