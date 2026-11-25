// Content is intentionally small, personal and grounded in the supplied portfolio.
// The same IDs connect semantic buttons, model components and interactive diagrams.
export const CAPABILITIES = Object.freeze({
  technology: {
    label: 'Build', kicker: 'CONNECTED SYSTEMS', title: 'Make technology useful.',
    description: 'Websites, applications and digital tools. I connect thoughtful interfaces with the systems that make them work.',
    detail: 'The layers connect: interface, logic, data.',
    example: 'Explore a learning experience', href: 'https://elasrag.com/adam/',
    diagram: 'layers',
  },
  ai: {
    label: 'Think', kicker: 'AI & INNOVATION', title: 'Explore what’s possible.',
    description: 'Exploring AI and emerging technology to make information approachable and new ideas useful.',
    detail: 'Connections grow into a structured network.',
    example: 'Start a conversation about an idea', href: 'mailto:mo@elasrag.com',
    diagram: 'network',
  },
  design: {
    label: 'Design', kicker: 'DESIGN & DEVELOPMENT', title: 'Give ideas their own form.',
    description: 'From an early sketch to an interactive experience. I bring structure, visual thinking and development together.',
    detail: 'Construction lines resolve into a usable form.',
    example: 'Explore this creation process', href: '#experience',
    diagram: 'construction',
  },
  strategy: {
    label: 'Solve', kicker: 'STRATEGY & PROBLEM SOLVING', title: 'Make complexity clear.',
    description: 'Understand the problem. Question assumptions. Connect the right pieces, then build something that makes sense.',
    detail: 'A considered route connects the starting point to a solution.',
    example: 'Tell me what you have in mind', href: 'mailto:mo@elasrag.com',
    diagram: 'path',
  },
  mo: {
    label: 'Meet Mo', kicker: 'THE PERSON BEHIND THE IDEAS', title: 'You can call me Mo.',
    description: 'I’m Mohamed El-Asrag. Curious by nature, creative by instinct, and fascinated by what technology can make possible.',
    detail: 'United Kingdom · Working globally',
    example: 'Say hello to Mo', href: 'mailto:mo@elasrag.com',
    diagram: 'signature',
  },
});

export function getCapability(id) {
  return Object.hasOwn(CAPABILITIES, id) ? CAPABILITIES[id] : null;
}

// Clicks and drags must remain separate, especially on touch screens.
export function isSelectionGesture(start, end) {
  return !!start && end.time >= start.time && end.time - start.time < 700 && Math.hypot(end.x - start.x, end.y - start.y) < 8;
}
