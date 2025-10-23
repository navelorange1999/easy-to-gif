import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useMemo,
	useCallback,
} from "react";

// 初始化状态类型
export interface InitializationState {
	isLoaded: boolean;
	isLoading: boolean;
	error: string | null;
	hasShownInitToast: boolean;
}

// 转换状态类型
export interface ConversionState {
	isConverting: boolean;
	progress: number;
	stage: "idle" | "converting" | "completed" | "error";
	message: string;
	error: string | null;
}

// Context 类型
interface AppContextType {
	// 初始化状态
	initState: InitializationState;
	setInitState: React.Dispatch<React.SetStateAction<InitializationState>>;

	// 转换状态
	conversionState: ConversionState;
	setConversionState: React.Dispatch<React.SetStateAction<ConversionState>>;

	// 重置状态
	resetStates: () => void;
}

// 创建 Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 组件
export function AppProvider({children}: {children: ReactNode}) {
	const [initState, setInitState] = useState<InitializationState>({
		isLoaded: false,
		isLoading: false,
		error: null,
		hasShownInitToast: false,
	});

	const [conversionState, setConversionState] = useState<ConversionState>({
		isConverting: false,
		progress: 0,
		stage: "idle",
		message: "",
		error: null,
	});

	const resetStates = useCallback(() => {
		setInitState({
			isLoaded: false,
			isLoading: false,
			error: null,
			hasShownInitToast: false,
		});
		setConversionState({
			isConverting: false,
			progress: 0,
			stage: "idle",
			message: "",
			error: null,
		});
	}, [setInitState, setConversionState]);

	const contextValue = useMemo(
		() => ({
			initState,
			setInitState,
			conversionState,
			setConversionState,
			resetStates,
		}),
		[
			initState,
			setInitState,
			conversionState,
			setConversionState,
			resetStates,
		]
	);

	return (
		<AppContext.Provider value={contextValue}>
			{children}
		</AppContext.Provider>
	);
}

// Hook 用于使用 Context
export function useAppContext() {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
}
