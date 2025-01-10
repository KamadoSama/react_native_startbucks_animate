import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

interface RenderIConProps {
    icon: React.ReactNode,
    onPress?: () => void,
    backgroundColor?: string
}

const RenderICon: React.FC<RenderIConProps> = ({ icon, onPress,backgroundColor }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, backgroundColor && {backgroundColor}]}>
            {icon}
        </TouchableOpacity>
    )
}

export default RenderICon

const styles = StyleSheet.create({
    container: {
        height:35,
        width:35,
        borderWidth: 2,
        borderRadius:4,
        borderColor:Colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10
    }
})