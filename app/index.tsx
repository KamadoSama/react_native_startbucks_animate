import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { useEffect } from 'react'
import RenderICon from '@/components/RenderICon'
import { Iconify } from 'react-native-iconify';
import { Image } from 'expo-image';
import images from '@/constants/images';
import { Colors } from '@/constants/Colors';
import FontSize from '@/constants/FontSize';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolate,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import {
    PanGestureHandler,
    GestureHandlerRootView,
    GestureEvent,
} from 'react-native-gesture-handler';
import { router } from 'expo-router';

const MAX_Y = 290;
const MAX_Y_OPACITY = 270;
const TEXTALIGN_THRESHOLD = 60;
const SCREEN_WIDTH = Dimensions.get('window').width
console.log(SCREEN_WIDTH);
const Index = () => {
    const translateY = useSharedValue(0);

    // Petite animation d'apparition
    useEffect(() => {
        translateY.value = withSpring(20, { damping: 5, stiffness: 150 }, () => {
            translateY.value = withSpring(0);
        });
    }, []);

    /**
     * Gère le drag vertical : clamp entre 0 et MAX_Y
     */
    const handleGestureEvent = (event: GestureEvent) => {
        const { translationY } = event.nativeEvent;
        console.log(translationY);
        // on clamp la valeur pour ne pas dépasser 0 ni MAX_Y
        if (translationY < 0) {
            translateY.value = 0;
        } else {
            translateY.value = translationY;
        }
    };

    /**
     * À la fin du drag : si l'utilisateur n'est pas à la limite,
     * on revient à 0. Sinon on reste à MAX_Y.
     */
    const handleGestureEnd = () => {
        if (translateY.value < 2) {
            translateY.value = translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
            console.log("stop");
        } else if (translateY.value > 30) {
            Vibration.vibrate(200); // Vibration lors de l'archivage
            translateY.value = withSpring(290, { damping: 10, stiffness: 100 });
        } else {
            translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
        }
    }
    /**
     * Animation du "drag button"
     * On le suit directement avec translateY
     */
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    /**
     * Animation du Matcha (le verre) : suit aussi translateY si souhaité
     */
    const animatedMatcha = useAnimatedStyle(() => {
        const height = interpolate(
            translateY.value,
            [0, MAX_Y],
            [379, 0],
            Extrapolate.CLAMP
        );

        const width = interpolate(
            translateY.value,
            [0, MAX_Y],
            [320, 0],
            Extrapolate.CLAMP
        );

        const opacity = translateY.value > MAX_Y_OPACITY ? 0 : 1;

        return {
            transform: [{ translateY: translateY.value }],
            // height,
            // width,
            opacity
        };
    });

    /**
     * On veut que le texte "STARBUCKS" change
     * de taille/position en fonction de translateY (de 0 à MAX_Y).
     */
    const animateText1 = useAnimatedStyle(() => {
        // Passe de 80 px à 60 px
        const fontSize = interpolate(
            translateY.value,
            [0, MAX_Y],
            [80, 60],
            Extrapolate.CLAMP
        );

        const align = translateY.value < TEXTALIGN_THRESHOLD ? 'left' : 'center';
        // On fait glisser left de -32 à 0 si on veut
        const left = interpolate(
            translateY.value,
            [0, MAX_Y],
            [-32, 0],
            Extrapolate.CLAMP
        );

        const right = interpolate(
            translateY.value,
            [0, MAX_Y],
            [-40, 0],
            Extrapolate.CLAMP
        );

        // top peut rester le même si on ne veut pas le bouger
        // ou bouger entre 0 et ... par exemple
        // Ici on garde top = 0
        const top = interpolate(
            translateY.value,
            [0, MAX_Y],
            [0, 0], // pas de changement
            Extrapolate.CLAMP
        );


        return {
            fontSize,
            left,
            textAlign: align,
            top,
            right,
            // position: 'absolute',

        };
    });

    const animateText2 = useAnimatedStyle(() => {

        const fontSize = interpolate(
            translateY.value,
            [0, MAX_Y],
            [80, 60],
            Extrapolate.CLAMP
        );

        const align = translateY.value < TEXTALIGN_THRESHOLD ? 'left' : 'center';

        const left = interpolate(
            translateY.value,
            [0, MAX_Y],
            [-32, 0],
            Extrapolate.CLAMP
        );

        const right = interpolate(
            translateY.value,
            [0, MAX_Y],
            [-40, 0],
            Extrapolate.CLAMP
        );

        const top = interpolate(
            translateY.value,
            [0, MAX_Y],
            [70, 0], // on peut le laisser fixe
            Extrapolate.CLAMP
        );

        return {
            fontSize,
            left,
            top,
            textAlign: align,
            right
        };
    });

    const animateText3 = useAnimatedStyle(() => {
        // Ex: fontSize 80 -> 60
        const fontSize = interpolate(
            translateY.value,
            [0, MAX_Y],
            [80, 60],
            Extrapolate.CLAMP
        );
        const align = translateY.value < TEXTALIGN_THRESHOLD ? 'left' : 'center';
        const left = interpolate(
            translateY.value,
            [0, MAX_Y],
            [-32, 0],
            Extrapolate.CLAMP
        );

        const right = interpolate(
            translateY.value,
            [0, MAX_Y],
            [-40, 0],
            Extrapolate.CLAMP
        );

        const top = interpolate(
            translateY.value,
            [0, MAX_Y],
            [140, 0],
            Extrapolate.CLAMP
        );

        return {
            fontSize,
            left,
            top,
            textAlign: align,
            right
        };
    });

    const animatedBag = useAnimatedStyle(() => {
        const top = interpolate(
            translateY.value,
            [0, MAX_Y],
            [70, -20],
            Extrapolate.CLAMP
        );

        return {
            top
        };
    });

    const animatedOpacityStarbucks = useAnimatedStyle(() => {
        const opacity = translateY.value >= MAX_Y ? withDelay(0, withTiming(1, { duration: 200 })) : 0;

        return {
            opacity
        };
    });

    const animatedOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateY.value,
            [0, MAX_Y],
            [1, 0],
            Extrapolate.CLAMP
        );

        return {
            opacity
        };
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <RenderICon
                            icon={<Iconify icon='humbleicons:arrow-left' size={20} color='black' />}
                            onPress={() => router.navigate("/cube")}
                        />
                        <Image source={images.logo_starbucks} style={styles.logo} />
                        <RenderICon
                            icon={<Iconify icon='material-symbols-light:shopping-bag-outline' size={19} color='black' />}
                        />
                    </View>

                    <View style={styles.title}>
                        <Text style={styles.titleText}>Frappuccino</Text>
                        <Text style={styles.subTitle}>Chá Matcha</Text>
                    </View>

                    <Animated.View style={[styles.middle, animatedOpacity]}>
                        <View style={styles.containCup}>
                            <Text style={styles.text}>Tamanho</Text>
                            <RenderICon
                                icon={<Iconify icon='circum:coffee-cup' size={24} color='black' />}
                            />
                            <RenderICon
                                icon={<Iconify icon='circum:coffee-cup' size={24} color='#fff' />}
                                backgroundColor={Colors.green}
                            />
                            <RenderICon
                                icon={<Iconify icon='circum:coffee-cup' size={24} color='black' />}
                            />
                        </View>

                        <View style={styles.containCup}>
                            <Text style={styles.text}>Favorito!</Text>
                            <RenderICon
                                icon={<Iconify icon='material-symbols:favorite-outline' size={24} color='black' />}
                            />
                        </View>
                    </Animated.View>

                    <View style={styles.bgTextContainer}>
                        
                        {/** 3 textes animés */}
                        <Animated.Text
                            style={[
                                styles.textExtraBig,
                                { color: Colors.green },
                                animateText1
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="clip"
                        >
                            STARBUCKS
                        </Animated.Text>
                        <Animated.Text
                            style={[
                                styles.textExtraBig,
                                { color: Colors.greenRgbaFifty },
                                animateText2
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="clip"
                        >
                            STARBUCKS
                        </Animated.Text>
                        <Animated.Text
                            style={[
                                styles.textExtraBig,
                                { color: Colors.greenRgbaTen },
                                animateText3
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="clip"
                        >
                            STARBUCKS
                        </Animated.Text>

                        {/** Le verre */}
                        <Animated.Image
                            source={images.matcha}
                            style={[styles.cupImage, animatedMatcha]}
                            contentFit="contain"
                        />
                        <Animated.View style={[styles.checkSymbol, animatedOpacityStarbucks]}>
                            <Iconify icon='bi:check' size={102} color='white' />
                        </Animated.View>

                        
                    </View>

                    <Animated.View style={[styles.car, animatedOpacity]}>
                        <RenderICon
                            icon={<Iconify icon='material-symbols-light:directions-car-outline' size={26} color={"#000"} />}
                        />
                    </Animated.View>

                    <Animated.View style={[styles.containPice, animatedOpacity]}>
                        <View>
                            <Text style={styles.price}>31,50 R$</Text>
                            <Text>Frappuccino Grande</Text>
                        </View>
                        <View>
                            <RenderICon
                                icon={<Iconify icon='ph:door-thin' size={20} color={"#000"} />}
                            />
                            <Text>Pegar</Text>
                        </View>
                    </Animated.View>

                    {/** Bas de l'écran : Drag */}
                    <View style={styles.bottom}>
                        <PanGestureHandler
                            onGestureEvent={handleGestureEvent}
                            onEnded={handleGestureEnd}
                        >
                            <View style={styles.containDrag}>
                                <Animated.Text style={[styles.dragText, animatedOpacity]}>
                                    deslize para baixo
                                </Animated.Text>
                                {/** Drag button */}
                                <Animated.View style={[styles.dragButton, animatedStyle]}>
                                    <Image source={images.drag} style={{ width: "100%", height: "100%" }} />
                                </Animated.View>
                            </View>
                        </PanGestureHandler>

                        <Animated.View style={[styles.containBagShopping, animatedBag]}>
                            <Image
                                source={images.shopping_bag_2}
                                style={{ width: 250, height: 200 }}
                                contentFit='contain'
                            />
                            <Animated.Image
                                source={images.logo_starbucks_opacity}
                                style={[styles.logoStarbucksOpacity, animatedOpacityStarbucks]}

                            />
                        </Animated.View>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: 16
    },
    price: {
        fontWeight: "900",
        fontSize: FontSize.large,
    },
    containPice: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 10
    },
    logo: {
        height: 44,
        width: 44,
        borderRadius: 22
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    title: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: FontSize.big,
        fontWeight: "regular"
    },
    subTitle: {
        fontSize: FontSize.xLarge,
        color: Colors.gray
    },
    containCup: {
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 10
    },
    text: {
        fontSize: FontSize.small,
        marginBottom: 10
    },
    middle: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textExtraBig: {
        fontSize: FontSize.extraBig,
        fontWeight: "800",
        position: 'absolute',
        left: -32,
        right: -40,
        // zIndex: 2,
    },
    bgTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
        height: 230,
    },
    foregroundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        // height: 400,
        // backgroundColor: 'red',
    },
    cupImage: {
        width: 320,
        height: 379,
        top: -40,
        zIndex: 1,
        // position: 'absolute',
    },
    car: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 13
    },
    dragButton: {
        marginTop: 5,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: 95,
        padding: 10,
        width: 44,
        borderRadius: 22,
        backgroundColor: "#101010"
    },
    containDrag: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        zIndex: 5
    },
    containBagShopping: {
        zIndex: 3,
        position: 'absolute',
        alignItems: 'center',
        top: 70,
        left: 0,
        right: 0,
        bottom: 0,
    },
    bottom: {
        position: "relative"
    },
    logoStarbucksOpacity: {
        position: 'absolute',
        width: 100,
        height: 100,
        top: 100
    },
    dragText: { textAlign: 'center', color: Colors.gray, fontSize: FontSize.small },
    checkSymbol: {
        backgroundColor: Colors.green,
        width: 102,
        height: 102,
        borderRadius: 102,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 100,

        // position: 'absolute',
    }
});
