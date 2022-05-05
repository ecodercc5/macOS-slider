import { SunIcon } from "@heroicons/react/solid";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useCallback, useState } from "react";

interface Props {
  value: number;
  onChange: (value: number) => any;
}

const normalizePercentage = (percentage: number): number => {
  // puts the percentage between 0 or 1 inclusive
  const normalizedPercentage = Math.max(Math.min(percentage, 1), 0);

  return normalizedPercentage;
};

const getSliderPosition = (x: number) => `calc(${x}px - 100%)`;

const sliderKnobVariants = {
  inactive: {
    backgroundColor: "#FFFFFF",
  },
  active: {
    backgroundColor: "#F0F0F0",
    transition: {
      duration: 0.15,
    },
  },
};

export const TestSlider: React.FC<Props> = ({ value, onChange }) => {
  // keeps track how much to translate the slider knob
  const x = useMotionValue(0);

  // ref to the slider track
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const sliderKnobRef = useRef<HTMLDivElement | null>(null);

  // mounted ref
  const isMountedRef = useRef<boolean>(false);

  // keeps track of dragging state
  const [isDragging, setIsDragging] = useState(false);

  // calculate position of the slider knob
  const translateX = useTransform(x, (latest) => getSliderPosition(latest));

  // avoid closure problems by always keep onChange up to date
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  const getSliderKnobWidth = useCallback(() => {
    const sliderKnob = sliderKnobRef.current!;
    const width = sliderKnob.offsetWidth;

    return width;
  }, []);

  // calculate how much to translate the slider knob on value change
  useLayoutEffect(() => {
    const sliderKnobWidth = getSliderKnobWidth();
    const sliderWidth = sliderTrackRef.current!.offsetWidth - sliderKnobWidth;
    const translateX_ = value * sliderWidth + sliderKnobWidth;

    if (!isMountedRef.current) {
      // manually sync state up first
      x.set(translateX_);
      translateX.set(getSliderPosition(translateX_));

      isMountedRef.current = true;

      return;
    }

    animate(x, translateX_, {
      type: "spring",
      stiffness: 200,
    });
  }, [value, x, getSliderKnobWidth, translateX]);

  const sliderKnobVariant = isDragging ? "active" : "inactive";

  const getSliderValueFromMouseEvent = (e: MouseEvent): number => {
    const sliderKnobWidth = getSliderKnobWidth();

    const sliderTrack = sliderTrackRef.current!;

    // get the maximum width the slider rail could be
    const maxWidth = sliderTrack.offsetWidth - sliderKnobWidth;

    // get bounding client rect
    const boundingClientRect = sliderTrack.getBoundingClientRect();
    const left = boundingClientRect.left;

    // get mouseX position
    const mouseX = e.clientX;
    const latest = mouseX - left;

    // normalize percentages
    const normalizedPercentage = normalizePercentage(
      (latest - sliderKnobWidth / 2) / maxWidth
    );

    return normalizedPercentage;
  };

  const notifySliderValueFromEvent = (e: MouseEvent) => {
    // calculate new slider value
    const sliderValue = getSliderValueFromMouseEvent(e);

    onChangeRef.current(sliderValue);
  };

  const handleMouseMove = (e: MouseEvent) => {
    notifySliderValueFromEvent(e);
  };

  const handleMouseUp = () => {
    // remove all event listeners in dragging state
    setIsDragging(false);

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);

    notifySliderValueFromEvent(e.nativeEvent);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="slider__track"
      ref={sliderTrackRef}
      onMouseDown={handleMouseDown}
    >
      <SunIcon className="slider__icon" />
      <motion.div className="slider__rail" style={{ width: x, minWidth: 20 }}>
        <motion.div
          ref={sliderKnobRef}
          initial={false}
          className="slider__knob knob__placeholder"
          animate={sliderKnobVariant}
          variants={sliderKnobVariants}
          style={{ x: translateX }}
        />
      </motion.div>
    </div>
  );
};
